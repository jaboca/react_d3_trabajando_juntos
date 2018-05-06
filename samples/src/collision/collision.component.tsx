import * as React from 'react';
import * as d3 from "d3";

const style = require("./collision.style.scss");


const ButtonComponent = ({label, onClick}) => (
  <button className={style.button} onClick={onClick}>
    {label}
  </button>
);

const TargetComponent = ({msg, color, id}) => (
  <h5
    className={style.target}
    id={id}
    style={{backgroundColor: color}}
  >
    {msg}
  </h5>
);

interface CollisionState {
  msg: string;
  color: string;
  targetId: string
}

export class CollisionComponent extends React.Component<{}, CollisionState> {
  constructor(props) {
    super(props);

    this.state = {
      msg: "Soy un componente de React",
      color: "#00eccc",
      targetId: "collision-target"
    }
  }

  private handleD3jsClick = () => {
    d3.select("#collision-target")
      .style("background-color", "#f68e48")
      .text("D3.js ha modificado este nodo");
  }

  private handleReactClick = () => {
    this.setState({
      ...this.state,
      msg: "React ha modificado este nodo",
      color: "#61dafb"
    })
  }

  public render() {
    return (
      <div className={style.container}>
        <div className={style.buttonsBar}>
          <ButtonComponent label="React" onClick={this.handleReactClick} />
          <ButtonComponent label="D3.js" onClick={this.handleD3jsClick} />
        </div>
        <TargetComponent
          msg={this.state.msg}
          color={this.state.color}
          id={this.state.targetId}
        />
      </div>
    );
  }
};