import React from 'react';
import { shallow, configure } from 'enzyme';
import SignInSide from './login.js';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link as ReactLink } from "react-router-dom";
describe('Should render SignInSide ', () => {

  it('should render correctly ', () => {
    const component = shallow(<SignInSide />);
    expect(component).toMatchSnapshot();
    component.unmount(); 
  });

  it('should render all 6 grid Correctly', () => {
    const component = shallow(<SignInSide />);
    expect(component.find(Grid)).toHaveLength(6)
    component.unmount()
  });

  it('should render Typography Correctly', () => {
    const component = shallow(<SignInSide />);
    expect(component.find(Typography)).toHaveLength(1)
    component.unmount()
  });

  it('Typography should have test Sign in', () => {
    const component = shallow(<SignInSide />);
    expect(component.find(Typography).getElements()[0].props.children).toEqual("Sign in")
    component.unmount()
  });

  it('should render all 2 TextField Correctly', () => {
    const component = shallow(<SignInSide />);
    expect(component.find(TextField)).toHaveLength(2)
    component.unmount()
  });

  it('should render all 2 FormControlLabel Correctly', () => {
    const component = shallow(<SignInSide />);
    expect(component.find(FormControlLabel)).toHaveLength(1)
    component.unmount()
  });

  it('should render ReactLink Correctly', () => {
    const component = shallow(<SignInSide />);
    expect(component.find(ReactLink)).toHaveLength(1)
    component.unmount()
  });

});
