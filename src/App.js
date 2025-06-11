import './App.css';
import defaultFace from './default.png';
import rootFace from './sigma.jpg';
import {
  client,
  useConfig,
  useElementData,
  useElementColumns,
} from '@sigmacomputing/plugin';
import { useEffect } from 'react';
import { OrgChart } from 'd3-org-chart';
import * as d3 from 'd3';

// Configure the editor panel with necessary fields
client.config.configureEditorPanel([
  { name: 'source', type: 'element' },
  { name: 'name', type: 'column', source: 'source', allowMultiple: false },
  { name: 'id', type: 'column', source: 'source', allowMultiple: false },
  { name: 'parentId', type: 'column', source: 'source', allowMultiple: false },
  { name: 'positionName', type: 'column', source: 'source' },
  { name: 'area', type: 'column', source: 'source' },
  { name: 'imageUrl', type: 'column', source: 'source' },
  { name: 'location', type: 'column', source: 'source' },
  { name: 'imageLabel', type: 'column', source: 'source', allowMultiple: false },
]);

// Function to render the organizational chart
function graph(data) {
  // Clear existing chart elements
  d3.selectAll('.container > *').remove();

  const chart = new OrgChart()
    .container('.container')
    .data(data)
    .nodeHeight(() => 110)
    .nodeWidth(() => 222)
    .childrenMargin(() => 50)
    .compactMarginBetween(() => 35)
    .compactMarginPair(() => 30)
    .neightbourMargin(() => 20)
    .buttonContent(({ node }) => {
      const icon = node.children
        ? '<i class="fas fa-chevron-up"></i>'
        : '<i class="fas fa-chevron-down"></i>';
      return `<div style="border-radius:3px;padding:3px;font-size:10px;margin:auto auto;background-color:lightgray">
                <span style="font-size:9px">${icon}</span> ${node.data._directSubordinates}
              </div>`;
    })
    .nodeContent((d) => {
      const imageDiffVert = 27;
      return `
        <div className="parent" style='width:${d.width}px;height:${d.height}px;padding-top:${imageDiffVert - 2}px;padding-left:1px;padding-right:1px;'>
          <div className="person-component" style="font-family: 'Inter', sans-serif;background-color:#FFFFFF;margin-left:-1px;width:${d.width - 2}px;height:${d.height - imageDiffVert}px;border-radius:10px;border: 1px solid #E4E2E9;display:flex;justify-content:center;align-items:center;flex-direction:column;position: relative">
            <img src="${d.data.imageUrl}" style="margin-left:-139px;border-radius:500px;width:50px;height:50px;position: fixed;top: -10px;" />
            <div className="name parent" style="position: fixed; top: 35px;">
              <div className="person name" style="font-size:15px;color:#08011E;margin-left:-100px;margin-top:5px;position: fixed;">${d.data.name}</div>
            </div>
            <div className="title parent" style="position: fixed; width: 200px;">
              <div className="person title" style="color:#4346FF;font-size:10px;font-weight: bold;width: fit-content;left: 12px;position: fixed;top: 62px;">${d.data.positionName}</div>
            </div>
            <div className="area parent" style="position: fixed; width: 200px;">
              <div className="person area" style="color:#716E7B;font-size:10px;width: fit-content;position: fixed;top: 80px;left: 12px;">${d.data.area}</div>
            </div>
            <div className="location parent" style="position: fixed; width: 200px; height: 70px;">
              <div className="person location" style="color:#716E7B;font-size:10px;width: fit-content;position: absolute;right: 0px;">${d.data.location}</div>
            </div>
          </div>
        </div>`;
    });

  if (data?.length) {
    chart.render();
    chart.expandAll();
    chart.render();
  }
}

// Function to transform the data into a format suitable for the chart
function transform(config, columns, sigmaData) {
  const { name, id, parentId, positionName, area, imageUrl, imageLabel, location } = config;

  const data = sigmaData[name]?.map((_, idx) => ({
    positionName: sigmaData[positionName]?.[idx],
    area: sigmaData[area]?.[idx],
    imageUrl: sigmaData[imageUrl]?.[idx] || defaultFace,
    imageLabel: sigmaData[imageLabel]?.[idx] || '',
    location: sigmaData[location]?.[idx],
    name: sigmaData[name][idx],
    id: sigmaData[id][idx],
    parentId: sigmaData[parentId][idx],
  })) || [];

  const roots = data.reduce((acc, item, idx) => {
    if (!item.parentId) acc.push(idx);
    return acc;
  }, []);

  if (roots.length > 1) {
    roots.forEach((idx) => {
      data[idx].parentId = 'Root';
    });

    data.push({
      positionName: '',
      area: 'area',
      imageUrl: rootFace,
      imageLabel: '',
      location: 'location',
      name: '',
      id: 'Root',
      parentId: null,
    });
  }

  return data;
}

// Main App component
function App() {
  const config = useConfig();
  const columns = useElementColumns(config.source);
  const sigmaData = useElementData(config.source);
  const iconArrays = sigmaData[client.config.getKey('imageUrl')];
  const labelColumnId = Object.keys(columns).find(column => columns[column].name === 'Entity Icon');
  const labels = sigmaData[labelColumnId];

  useEffect(() => {
    if (sigmaData && Object.keys(sigmaData).length > 0) {
      graph(transform(config, columns, sigmaData));
    }
  }, [config, columns, sigmaData]);

  // Remove duplicate entries from the legend
  const uniqueIcons = [];
  const uniqueEntries = new Set();

  if (iconArrays && labels) {
    iconArrays.forEach((iconUrl, index) => {
      const label = labels[index] || '';
      const entry = `${iconUrl}-${label}`;
      if (!uniqueEntries.has(entry)) {
        uniqueEntries.add(entry);
        uniqueIcons.push({ iconUrl, label });
      }
    });
  }

  return (
    <div className="App">
      <div className="container" />
      <div
        className="legend-container"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
        }}
      >
        {uniqueIcons.map(({ iconUrl, label }, index) => (
          <div
            key={index}
            className="legend-item"
            style={{
              margin: '0 10px',
              textAlign: 'center',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src={iconUrl || defaultFace}
              alt={label}
              className="legend-icon"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div
              className="legend-label"
              style={{
                fontSize: '14px',
                marginTop: '8px',
                color: '#333',
                fontWeight: '500',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
