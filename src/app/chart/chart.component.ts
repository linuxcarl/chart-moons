import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { DATA } from '../mocks/moons';

@Component({
  selector: 'app-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  private width: number;
  private height: number;

  private svg: any; // TODO replace all `any` by the right type

  private radius: number;

  private arc: any;
  private pie: any;
  private color: any;

  private g: any;
  domain: string[];
  constructor() {
    this.domain = DATA.map((data) => data.type );
  }

  ngOnInit() {
    this.initSvg();
    this.drawChart(DATA);
    this.drawChartSmall(DATA);
  }

  private initSvg() {
    this.svg = d3.select('svg');

    this.width = +this.svg.attr('width');
    this.height = +this.svg.attr('height');
    this.radius = Math.min(this.width, this.height) / 2;

    this.color = d3Scale.scaleOrdinal()
    .domain(this.domain)  
    .range(['#87d546', '#356816']);
    /*.range([
        '#87d546',
        '#356816',
        '#7b6888',
        '#6b486b',
        '#a05d56',
        '#d0743c',
        '#ff8c00',
      ]);
      */
    this.arc = d3Shape
      .arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 25);

    this.pie = d3Shape
      .pie()
      .sort(null)
      .value((d: any) => d.population);

    this.svg = d3
      .select('svg')
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private drawChart(data: any[]) {
    let g = this.svg
      .selectAll('.arc')
      .data(this.pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', this.arc)
      .style('fill', (d) => this.color(d.data.porcent));

    g.append('text')
      .attr('transform', (d) => 'translate(' + this.arc.centroid(d) + ')')
      .attr('dy', '.35em')
      .text();
  }
  private drawChartSmall(data: any[]) {
    /*let g = this.svg
      .selectAll('.legend')
      .data(this.color.domain())
      .enter()
      .append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', this.arc)
      .style('fill', (d) => this.color(d.data.type));
      */
    const legendRectSize = 13;
    const legendSpacing = 7;
    const length = this.domain.length;
    
    const legend = this.svg
      .selectAll('.legend') //the legend and placement
      .data(this.domain)
      .enter()
      .append('g')
      .attr('class', 'slegend')
      .attr('transform', function (d, i) {
        const height = legendRectSize + legendSpacing;
        const offset = 1;
        const horz = 1 ;
        const vert = i * 25;
        return 'translate(' + horz + ',' + vert + ')';
      });
    legend
      .append('rect') //keys
      .style('fill', this.color)
      .style('stroke', this.color)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', '.5rem');
    legend
      .append('text') //labels
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function (d) {
        return d;
      });
  }
}
