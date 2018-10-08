import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Wrapper = styled.div`
  font-family: 'Source Sans Pro', sans-serif;
`

const primaryColor = "#010043";
const secondaryColor = "#FD2CA9";

const Header = styled.div`
  color: white;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 140px;
  font-size: 24px;
`

const BigText = styled.div`
  font-size: 60px;
  font-weight: bold;
  margin-bottom: 15px;
  color: ${props => props.color || 'white'};
`

const HeroSection = styled.div`
  background: linear-gradient(180deg, ${primaryColor} 0%, #FD2CA9 100%);
  width: 100%;
  height: 500px;
  position: relative;
`
const CallToAction = styled.button`
  margin: 15px;
  background-color: white;
  color: ${primaryColor}
  border-radius: 5px;
  padding: 10px;
  font-size: 18px;
`

const TextualCallToAction = styled.div`
    font-size: 18px;
    margin-top: 15px;
`

const EmphasizedText = styled.span`
  font-style: italic;
`

const NormalText = styled.span`
  font-weight: normal;
`

const NavLogo = styled.div`
  position: absolute;
  left: 50px;
  top: 15px;
  color: white;
  font-size: 30px;
  font-weight: bold;
`

const EmailSubmitWrapper = styled.div`
  margin: 25px;
`

const headerLineHeight = 30;
const emailSubmitHeight = 30;
const emailSubmitFontSize = 24;

const EmailSubmitInput = styled.input`
  height: ${emailSubmitHeight}px;
  border: 0px;
  border-radius: 5px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  line-height: ${headerLineHeight}px;
  color: ${secondaryColor};
  max-width: 350px;
  font-size: ${emailSubmitFontSize}px;
  padding: 10px;
`

const EmailSubmitButton = styled.button`
  background-color: ${props => props.bgColor || primaryColor};
  color: white;
  height: ${emailSubmitHeight + 20}px;
  border: 0px;
  border-radius: 5px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  line-height: ${headerLineHeight}px;
  font-size: ${emailSubmitFontSize}px;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
`

const Main = styled.div`
  margin: 0 auto;
`

const Section = styled.div`
  min-height: ${props => props.height}px;
  padding: 50px;
  text-align: center;
  background-color: ${props => props.bgColor || "white"};
`

const SectionHeader = styled.div`
  font-size: 30px;
  font-weight: bold;
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 15px;
  color: ${props => props.color || 'white'};
`

export default class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emailInput: ""
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputSubmit = this.handleInputSubmit.bind(this)
  }

  handleInputChange (e) {
    this.setState({ emailInput: e.target.value });
  }

  handleInputSubmit (e) {
    axios.post('http://e925a452.ngrok.io/subscribe', {
      email: this.state.emailInput
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    console.log(this.state.emailInput)
  }

  render() {
    return (
      <Wrapper>
        <HeroSection>
          <NavLogo>
            $_ {"  "}send<NormalText>put</NormalText>
          </NavLogo>
          <Header>
            <BigText>
              Waiting for reimbursments?
            </BigText>
            Don't. We'll pay your outstanding expense reports <EmphasizedText>now.</EmphasizedText>
            {/* <TextualCallToAction>
              Enter your email to get started.
            </TextualCallToAction> */}
            <EmailSubmitWrapper>
              <EmailSubmitInput value={this.state.emailInput} placeholder="Email" onChange={this.handleInputChange} />
              <EmailSubmitButton type="submit" onClick={this.handleInputSubmit} bgColor={secondaryColor}>Get paid</EmailSubmitButton>
            </EmailSubmitWrapper>
          </Header>
          {/* <CallToAction>Get paid now</CallToAction> */}
        </HeroSection>
        <Main>
          <Section height={200}>
            <SectionHeader color={primaryColor}>
              Get reimbursed in days, not weeks with Dharma loans
            </SectionHeader>
            <iframe style={{ border: "0px", marginTop: "25px", width: "100%", height: "500px" }} src={"http://localhost:3001"} />
          </Section>
          <Section height={130} bgColor={primaryColor}>
            <SectionHeader color={'white'}>
              Get verified fast with Bloom
            </SectionHeader>
            <EmailSubmitWrapper>
              <EmailSubmitInput value={this.state.emailInput} placeholder="Email" onChange={this.handleInputChange} />
              <EmailSubmitButton type="submit" onClick={this.handleInputSubmit} bgColor={secondaryColor}>Get paid now</EmailSubmitButton>
            </EmailSubmitWrapper>
          </Section>
        </Main>
      </Wrapper>
    )
  }
}
