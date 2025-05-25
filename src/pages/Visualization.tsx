import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import type { OrganizationalUnit } from '../types';

// Mock data for AD structure
const mockADStructure: OrganizationalUnit = {
  id: 'root',
  name: 'company.com',
  path: 'DC=company,DC=com',
  children: [
    {
      id: 'departments',
      name: 'Departments',
      path: 'OU=Departments,DC=company,DC=com',
      parentId: 'root',
      children: [
        {
          id: 'it',
          name: 'IT',
          path: 'OU=IT,OU=Departments,DC=company,DC=com',
          parentId: 'departments',
          children: [],
          users: [
            { id: '1', username: 'john.doe', displayName: 'John Doe', email: 'john.doe@company.com', department: 'IT', title: '軟體工程師', isActive: true, createdDate: new Date(), groups: [], ou: '' },
            { id: '2', username: 'jane.smith', displayName: 'Jane Smith', email: 'jane.smith@company.com', department: 'IT', title: 'IT 經理', isActive: true, createdDate: new Date(), groups: [], ou: '' }
          ],
          groups: []
        },
        {
          id: 'hr',
          name: 'HR',
          path: 'OU=HR,OU=Departments,DC=company,DC=com',
          parentId: 'departments',
          children: [],
          users: [
            { id: '3', username: 'bob.wilson', displayName: 'Bob Wilson', email: 'bob.wilson@company.com', department: 'HR', title: 'HR 專員', isActive: false, createdDate: new Date(), groups: [], ou: '' }
          ],
          groups: []
        },
        {
          id: 'finance',
          name: 'Finance',
          path: 'OU=Finance,OU=Departments,DC=company,DC=com',
          parentId: 'departments',
          children: [],
          users: [],
          groups: []
        }
      ],
      users: [],
      groups: []
    },
    {
      id: 'users',
      name: 'Users',
      path: 'OU=Users,DC=company,DC=com',
      parentId: 'root',
      children: [],
      users: [],
      groups: []
    }
  ],
  users: [],
  groups: []
};

export function Visualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [adStructure, setAdStructure] = useState<OrganizationalUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'radial'>('tree');

  useEffect(() => {
    // 模擬 API 調用
    setTimeout(() => {
      setAdStructure(mockADStructure);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (adStructure && svgRef.current) {
      drawVisualization();
    }
  }, [adStructure, viewMode]);

  const drawVisualization = () => {
    if (!svgRef.current || !adStructure) return;

    // 清除之前的內容
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;
    
    svg.attr("width", width).attr("height", height);

    // 建立縮放行為
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g");

    // 轉換數據為 D3 階層結構
    const root = d3.hierarchy(adStructure);
    
    if (viewMode === 'tree') {
      // 樹狀圖佈局
      const treeLayout = d3.tree<OrganizationalUnit>()
        .size([height - 100, width - 200]);
      
      treeLayout(root);

      // 繪製連接線
      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal<any, any>()
          .x(d => (d.y || 0) + 100)
          .y(d => (d.x || 0) + 50))
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2);

      // 繪製節點
      const node = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${(d.y || 0) + 100},${(d.x || 0) + 50})`);

      // 節點圓圈
      node.append('circle')
        .attr('r', d => d.children ? 8 : 6)
        .attr('fill', d => {
          if (d.data.name === 'company.com') return '#3b82f6';
          if (d.children) return '#10b981';
          return '#f59e0b';
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      // 節點標籤
      node.append('text')
        .attr('dy', '.35em')
        .attr('x', d => d.children ? -15 : 15)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .style('font-size', '12px')
        .style('font-family', 'Arial, sans-serif')
        .text(d => d.data.name);

      // 使用者計數標籤
      node.filter(d => d.data.users && d.data.users.length > 0)
        .append('text')
        .attr('dy', '1.5em')
        .attr('x', d => d.children ? -15 : 15)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .style('font-size', '10px')
        .style('fill', '#666')
        .text(d => `${d.data.users?.length || 0} 使用者`);

    } else {
      // 放射狀佈局
      const radius = Math.min(width, height) / 2 - 100;
      const tree = d3.tree<OrganizationalUnit>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

      tree(root);

      g.attr("transform", `translate(${width / 2},${height / 2})`);

      // 繪製連接線
      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkRadial<any, any>()
          .angle(d => d.x || 0)
          .radius(d => d.y || 0))
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2);

      // 繪製節點
      const node = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `rotate(${((d.x || 0) * 180 / Math.PI) - 90}) translate(${d.y || 0},0)`);

      node.append('circle')
        .attr('r', d => d.children ? 8 : 6)
        .attr('fill', d => {
          if (d.data.name === 'company.com') return '#3b82f6';
          if (d.children) return '#10b981';
          return '#f59e0b';
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      node.append('text')
        .attr('dy', '.35em')
        .attr('x', d => (d.x || 0) < Math.PI === !d.children ? 6 : -6)
        .style('text-anchor', d => (d.x || 0) < Math.PI === !d.children ? 'start' : 'end')
        .attr('transform', d => (d.x || 0) >= Math.PI ? 'rotate(180)' : null)
        .style('font-size', '12px')
        .style('font-family', 'Arial, sans-serif')
        .text(d => d.data.name);
    }
  };

  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.5
      );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1 / 1.5
      );
    }
  };

  const handleReset = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">載入 AD 結構資料中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AD 結構視覺化</h1>
          <p className="mt-1 text-sm text-gray-500">
            互動式 Active Directory 組織結構圖
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'tree'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              樹狀圖
            </button>
            <button
              onClick={() => setViewMode('radial')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'radial'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              放射圖
            </button>
          </div>
        </div>
      </div>

      {/* Visualization Controls */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomIn}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>網域</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>組織單位</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>葉節點</span>
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              匯出 SVG
            </button>
          </div>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <svg
            ref={svgRef}
            className="w-full"
            style={{ minHeight: '600px', cursor: 'grab' }}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">結構統計</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">組織單位總數:</span>
              <span className="text-sm font-medium">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">使用者總數:</span>
              <span className="text-sm font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">最大深度:</span>
              <span className="text-sm font-medium">3</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">部門分佈</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">IT:</span>
              <span className="text-sm font-medium">2 使用者</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">HR:</span>
              <span className="text-sm font-medium">1 使用者</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Finance:</span>
              <span className="text-sm font-medium">0 使用者</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">活躍狀態</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">活躍使用者:</span>
              <span className="text-sm font-medium text-green-600">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">停用使用者:</span>
              <span className="text-sm font-medium text-red-600">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">活躍率:</span>
              <span className="text-sm font-medium">66.7%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 