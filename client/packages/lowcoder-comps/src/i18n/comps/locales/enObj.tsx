import { I18nObjects } from "./types";
import { chartColorPalette } from "lowcoder-sdk";

export const enObj: I18nObjects = {
  defaultDataSource: [
    {
      date: "2021-09",
      department: "Administration",
      spending: 9003,
      budget: 8000,
    },
    {
      date: "2021-09",
      department: "Finance",
      spending: 3033,
      budget: 4000,
    },
    {
      date: "2021-09",
      department: "Sales",
      spending: 9230,
      budget: 8000,
    },
    {
      date: "2021-10",
      department: "Administration",
      spending: 13032,
      budget: 15000,
    },
    {
      date: "2021-10",
      department: "Finance",
      spending: 2300,
      budget: 5000,
    },
    {
      date: "2021-10",
      department: "Sales",
      spending: 7323.5,
      budget: 8000,
    },
    {
      date: "2021-11",
      department: "Administration",
      spending: 13000,
      budget: 16023,
    },
    {
      date: "2021-11",
      department: "Finance",
      spending: 3569.5,
      budget: 3000,
    },
    {
      date: "2021-11",
      department: "Sales",
      spending: 10000,
      budget: 9932,
    },
    {
      date: "2021-12",
      department: "Administration",
      spending: 18033,
      budget: 20000,
    },
    {
      date: "2021-12",
      department: "Finance",
      spending: 4890,
      budget: 4500,
    },
    {
      date: "2021-12",
      department: "Sales",
      spending: 9322,
      budget: 8000,
    },
  ],

  defaultEchartsJsonOption: {
    data: [
      { value: 100, name: "Show",color:'#fc8452' },
      { value: 80, name: "Click" ,color:'#9a60b4'},
      { value: 60, name: "Visit" ,color:'#fac858'},
      { value: 40, name: "Query" ,color:'#ee6666'},
      { value: 20, name: "Buy" ,color:'#3ba272'},
        ],
  },
  defaultFunnelChartOption: {
    data: [
      { value: 100, name: "Show",color:'#fc8452' },
      { value: 80, name: "Click" ,color:'#9a60b4'},
      { value: 60, name: "Visit" ,color:'#fac858'},
      { value: 40, name: "Query" ,color:'#ee6666'},
      { value: 20, name: "Buy" ,color:'#3ba272'},
        ],
  },
  defaultGaugeChartOption: {
    data: [
      { value: 60, name: "Completed",color:'#fc8452' }
    ]
  },
  defaultSankeyChartOption: {
    data: [
      {name: "Show"},
      {name: "Click"},
      {name: "Visit"},
      {name: "Query"},
      {name: "Buy"}
    ],
    links: [
      {source: "Show", target: "Click", value: 80},
      {source: "Click", target: "Visit", value: 60},
      {source: "Visit", target: "Query", value: 40},
      {source: "Query", target: "Buy", value: 20}
    ]
  },
  defaultCandleStickChartOption: {
    xAxis: {
    data: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]
  },
    data:[
        [100, 200, 50, 150],
        [120, 220, 80, 180],
        [80, 150, 60, 130],
        [130, 230, 110, 190],
        [90, 180, 70, 160]
      ]
  },
  defaultRadarChartOption: {
    indicator: [
        { name: "Indicator 1", max: 100 },
        { name: "Indicator 2", max: 100 },
        { name: "Indicator 3", max: 100 },
        { name: "Indicator 4", max: 100 },
        { name: "Indicator 5", max: 100 }
    ],
    series: [
       {
      "name": "Data 1",
      "data": [
        {
          "value": [90, 80, 70, 60, 50],
          "name": "Data 1"
        }
      ]
      },
      {
      "name": "Data 2",
      "data": [
        {
          "value": [70, 60, 50, 40, 30],
          "name": "Data 2"
        }
      ]
    }
    ]
  },
  defaultHeatmapChartOption: {
    xAxis: {
    "data": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  yAxis: {
    "data": ["Morning", "Afternoon", "Evening"]
    },
  data: [
        [0, 0, 10],
        [0, 1, 20],
        [0, 2, 30],
        [1, 0, 40],
        [1, 1, 50],
        [1, 2, 60],
        [2, 0, 70],
        [2, 1, 80],
        [2, 2, 90],
        [3, 0, 100],
        [3, 1, 90],
        [3, 2, 80],
        [4, 0, 70],
        [4, 1, 60],
        [4, 2, 50],
        [5, 0, 40],
        [5, 1, 30],
        [5, 2, 20],
        [6, 0, 10],
        [6, 1, 0],
        [6, 2, 10]
      ]
  },
  defaultGraphChartOption: {
     categories: [
        {name: "Nodes"},
        {name: "Edges"}
      ],
      nodes: [
        {name: "Node 1", category: 0},
        {name: "Node 2", category: 0},
        {name: "Node 3", category: 0}
      ],
      links: [
        {source: "Node 1", target: "Node 2", category: 1},
        {source: "Node 2", target: "Node 3", category: 1}
      ]
  },
  defaultTreeChartOption: {
    data: [{
        name: "Parent",
        children: [
          {
            name: "Child 1",
            children: [
              { name: "Child 1-1" },
              { name: "Child 1-2" }
            ]
          },
          {
            name: "Child 2",
            children: [
              { name: "Child 2-1" },
              { name: "Child 2-2" }
            ]
          }
        ]
      }]
  },
  defaultTreemapChartOption: {
    data: [
        {
          name: 'nodeA',
          value: 10,
          children: [
            {
              name: 'nodeAa',
              value: 4,
            },
            {
              name: 'nodeAb',
              value: 6
            }
          ]
        },
        {
          name: 'nodeB',
          value: 20,
          children: [
            {
              name: 'nodeBa',
              value: 20,
              children: [
                {
                  name: 'nodeBa1',
                  value: 20
                }
              ]
            }
          ]
        }
      ]
  },
  defaultSunburstChartOption: {
    data: [
       {
          name: "Grandparent",
          children: [
            {
              name: "Parent A",
              children: [
                {name: "Child A1", value: 10},
                {name: "Child A2", value: 20}
              ]
            },
            {
              name: "Parent B",
              children: [
                {name: "Child B1", value: 15},
                {name: "Child B2", value: 25}
              ]
            }
          ]
        }
    ]
  },
  defaultCalendarChartOption: {
    data:[
        ["2022-01-01", 10],
        ["2022-02-05", 30],
        ["2022-03-15", 50],
        ["2022-04-20", 70],
        ["2022-05-25", 90],
        ["2022-06-30", 100],
        ["2022-07-10", 80],
        ["2022-08-20", 60],
        ["2022-09-25", 40],
        ["2022-10-30", 20],
        ["2022-11-05", 5]
      ]
  },
  defaultThemeriverChartOption: {
    data: [
        ["2024-01-01", 10, "Category A"],
        ["2024-01-02", 15, "Category A"],
        ["2024-01-03", 20, "Category A"],
        ["2024-01-04", 25, "Category A"],
        ["2024-01-05", 30, "Category A"],
        ["2024-01-06", 35, "Category A"],
        ["2024-01-07", 40, "Category A"],
        ["2024-01-08", 45, "Category A"],
        ["2024-01-09", 50, "Category A"],
        ["2024-01-10", 55, "Category A"],
        ["2024-01-01", 15, "Category B"],
        ["2024-01-02", 20, "Category B"],
        ["2024-01-03", 25, "Category B"],
        ["2024-01-04", 30, "Category B"],
        ["2024-01-05", 35, "Category B"],
        ["2024-01-06", 40, "Category B"],
        ["2024-01-07", 45, "Category B"],
        ["2024-01-08", 50, "Category B"],
        ["2024-01-09", 55, "Category B"],
        ["2024-01-10", 60, "Category B"]
      ]
  },
};
