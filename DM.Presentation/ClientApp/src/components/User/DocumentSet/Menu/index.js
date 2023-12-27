import React, { Component } from "react";

import styled from "styled-components";

export default class Menu extends Component {
  render() {
    return (
      <Container>
        {this.props.content.map((c) => (
          <InnerContainer
            key={c.info}
            className="content"
            style={c.style}
            onClick={c.onClick}
          >
            {c.info}
          </InnerContainer>
        ))}
      </Container>
    );
  }
}

const Container = styled.div`
  position: absolute;
  background: white;
  width: 200px;
  z-index: 1000;
  border: 1px solid rgba(221, 224, 228, 0.5);
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  & .content {
    padding: 15px;
    transition: background 250ms ease-in;
    &:hover {
      background: #eeeff1;
    }
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;
