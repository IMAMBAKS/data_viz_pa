import {Directive, ElementRef, Input, OnChanges} from '@angular/core';

@Directive({
    selector: 'myHorizontalBarChart'
})

export class HorizontalBarChartDirective implements OnChanges {

    // data input for my bar chart
    @Input() barChartData;

    public divs: any;

    render(barChartData: any) {

        d3.select('.myHorizontalBarChartGraph').remove();

        console.log('myhorizontalbarCHART: ');
        console.log(barChartData);


        // create window for your chart;
        let margin = {top: 60, right: 60, bottom: 60, left: 150},
            width = 1000 - margin.right - margin.left,
            height = 500 - margin.top - margin.bottom;

        let svg = this.divs.append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'myHorizontalBarChartGraph')
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // scales
        let x = d3.scale.linear()
            .range([margin.left, width - margin.right]);

        let y = d3.scale.ordinal()
            .rangeRoundBands([height - margin.bottom, margin.top], 0.1, .3);


        // axes
        let xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        let axisData = [
            {axis: xAxis, dx: 0, dy: (height - margin.bottom), clazz: 'x'},
            {axis: yAxis, dx: margin.left, dy: 0, clazz: 'y'}
        ];

        // standard graph drawing function
        function redraw(data) {
            // fill in here

            let total_list = [];
            for (let d of data) {
                total_list.push(+d.value);
            }
            y.domain(data.map((d, i) => d.workspace));
            x.domain([0, d3.max(total_list)]);


            let bars = svg.selectAll('rect.bar')
                .data(data);

            bars.enter()
                .append('rect')
                .classed('bar', true);

            bars
                .attr('y', (d, i) => y(d.workspace))
                .attr('height', y.rangeBand())
                .attr('x', x(0))
                .attr('width', 0)
                .transition()
                .delay((d, i) => i * 50)
                .duration(800)
                .attr('width', (d) => x(d.value));

            // change colour of greatest 3 assets
            bars.style('fill', (d) => {


                if (d.value < 30) {
                    return 'gray';
                }
            });

            let axis = svg.selectAll('g.axis')
                .data(axisData);

            axis.enter().append('g')
                .classed('axis', true);

            axis.each(function (d) {
                d3.select(this)
                    .attr('transform', 'translate(' + d.dx + ',' + d.dy + ')')
                    .classed(d.clazz, true)
                    .call(d.axis);
            });
        }


        redraw(barChartData);


    }

    constructor(elementRef: ElementRef) {

        let el: any = elementRef.nativeElement;

        this.divs = d3.select(el);

    }


    ngOnChanges() {

        // only render when barChartData exists
        if (this.barChartData) {
            this.render(this.barChartData);
        }

    }

}
