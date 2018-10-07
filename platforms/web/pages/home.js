import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`

`

const primaryColor = "#010043";

const Header = styled.div`
  color: white;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  padding-top: 300px;
`

const HeroSection = styled.div`
  background: linear-gradient(180deg, ${primaryColor} 0%, #FD2CA9 100%);
  width: 100%;
  height: 500px;
`
const CallToAction = styled.button`
  margin: 25px;
  background-color: white;
  color: ${primaryColor}
  border-radius: 5px;
  padding: 10px;
`

export default () => {
  return (
    <Wrapper>
      <HeroSection>
        <Header>Don't wait to receive your outstanding reimbursments</Header>
        <CallToAction>Get paid now</CallToAction>
      </HeroSection>
    </Wrapper>
  )
}
