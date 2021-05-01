import React from 'react';
import { shallow, configure } from 'enzyme';
import VideoHistory from './videohistory.js';

describe('Should render Homepage ', () => {

  it('should render correctly ', () => {
    const component = shallow(<VideoHistory />);
    expect(component).toMatchSnapshot();
    component.unmount(); 
  });

  it('should render both Buttons Correctly', () => {
    const component = shallow(<VideoHistory />);
    expect(component.find("button")).toHaveLength(1)
    component.unmount()
  });

  it('Buttons text check', () => {
    const component = shallow(<VideoHistory />);
    expect(component.find("button").getElement().props.children).toEqual("Fetch Video History")
    component.unmount()
  });

  it('Should Render headings correctly', () => {
    const component = shallow(<VideoHistory />);
    expect(component.find("h1").getElements()[0].props.children).toEqual("Previously searched videos")
    expect(component.find("h2").getElements()[0].props.children).toEqual("Click on a video to play it!!")
    component.unmount()
  });

  it('Should Render video div correctly', () => {
    const component = shallow(<VideoHistory />);
    expect(component.find("div.videos").getElements().length).toEqual(1)
    component.unmount()
  });
  

});
