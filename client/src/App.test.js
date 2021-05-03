import React from 'react';
import { shallow, configure } from 'enzyme';
import App from './App.js';
import {BrowserRouter, Route} from "react-router-dom";

describe('Should render App ', () => {

  it('should render correctly ', () => {
    const component = shallow(<App />);
    expect(component).toMatchSnapshot();
    component.unmount(); 
  });

  it('should render BrowserRouter correctly', () => {
    const component = shallow(<App />);
    expect(component.find(BrowserRouter)).toHaveLength(1)
    component.unmount()
  });

  it('should render all 3 Route ', () => {
    const component = shallow(<App />);
    expect(component.find(Route)).toHaveLength(3)
    component.unmount()
  });

  it('should have correct route props path', () => {
    const component = shallow(<App />);
    expect(component.find(Route).getElements()[0].props.path).toEqual("/")
    expect(component.find(Route).getElements()[1].props.path).toEqual("/home")
    expect(component.find(Route).getElements()[2].props.path).toEqual("/vhistory")
    component.unmount()
  });

  it('should have correct route props exact property ', () => {
    const component = shallow(<App />);
    expect(component.find(Route).getElements()[0].props.exact).toBeTruthy()
    expect(component.find(Route).getElements()[1].props.exact).toBeTruthy()
    expect(component.find(Route).getElements()[2].props.exact).toBeTruthy()
    component.unmount()
  });

});
