import { SVGSelection } from "../models/types";
import { Link } from "../models/link";
import { InterfaceLabel } from "../models/interface-label";
import { CssFixer } from "../helpers/css-fixer";


export class InterfaceLabelWidget {
  private cssFixer: CssFixer;

  constructor() {
    this.cssFixer = new CssFixer();
  }

  draw(selection: SVGSelection) {

    const labels = selection
      .selectAll<SVGTextElement, InterfaceLabel>('text.interface_label')
      .data((l: Link) => {
        const sourceInterface = new InterfaceLabel(
          Math.round(l.source.x + l.source.width + l.nodes[0].label.x),
          Math.round(l.source.y + l.source.height + l.nodes[0].label.y),
          l.nodes[0].label.text,
          l.nodes[0].label.style,
          l.nodes[0].label.rotation
        );

        const targetInterface = new InterfaceLabel(
          Math.round(l.target.x + l.target.width / 2. + l.nodes[1].label.x),
          Math.round(l.target.y + l.target.height / 2.  + l.nodes[1].label.y),
          l.nodes[1].label.text,
          l.nodes[1].label.style,
          l.nodes[1].label.rotation
        );

        return [sourceInterface, targetInterface];
      });

    const enter = labels
      .enter()
        .append<SVGTextElement>('text')
          .attr('class', 'interface_label noselect');

    const merge = labels
      .merge(enter);

    merge
      .text((l: InterfaceLabel) => l.text)
      .attr('x', function(this: SVGTextElement, l: InterfaceLabel) {
        const bbox = this.getBBox();
        return l.x;
      })
      .attr('y', function(this: SVGTextElement, l: InterfaceLabel)  {
        const bbox = this.getBBox();
        return l.y;
      })
      .attr('style', (l: InterfaceLabel) => this.cssFixer.fix(l.style))
      .attr('transform', (l: InterfaceLabel) => `rotate(${l.rotation}, ${l.x}, ${l.y})`);

    labels
      .exit()
      .remove();

  }
}
