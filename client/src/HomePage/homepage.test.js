import React from 'react';
import { shallow, configure } from 'enzyme';
import HomePage from './homepage';
import Button from '@material-ui/core/Button';

describe('Should render Homepage ', () => {

  it('should render correctly ', () => {
    const component = shallow(<HomePage />);
    expect(component).toMatchSnapshot();
    component.unmount(); 
  });

  it('should render both Buttons Correctly', () => {
    const component = shallow(<HomePage />);
    expect(component.find(Button)).toHaveLength(3)
    component.unmount()
  });


  it('Buttons have correct texts', () => {
    const component = shallow(<HomePage />);
    expect(component.find(Button).getElements()[0].props.children[0]).toEqual("Upload File")
    
    component.unmount()
  });

  it('Should Render Video Label', () => {
    const component = shallow(<HomePage />);
    expect(component.find("label").getElements()[0].props.children).toEqual("Video   ")
    component.unmount()
  });

  it('Should Render 1 Video iframe', () => {
    const component = shallow(<HomePage />);
    expect(component.find("iframe").getElements().length).toEqual(1)
    component.unmount()
  });

});
