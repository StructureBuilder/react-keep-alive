import React from 'react';
import {mount} from 'enzyme';
import Comment from '../src/components/Comment';

describe('<Comment>', () => {
  it('the render function will render a div element', () => {
    const wrapper = mount(<Comment>test</Comment>);
    expect(wrapper.html()).toEqual('<div></div>');
  });


  it('rendered <div> will be replaced with comment nodes', () => {
    const wrapper = mount(
      <div>
        <Comment>test</Comment>
      </div>
    );
    expect(wrapper.html()).toContain('<!--test-->');
  });

  it('the comment node will be restored to <div> when uninstalling', () => {
    const componentWillUnmount = Comment.prototype.componentWillUnmount;
    const wrapper = mount(
      <div>
        <Comment>test</Comment>
      </div>
    );
    Comment.prototype.componentWillUnmount = function () {
      componentWillUnmount.call(this);
      expect(wrapper.html()).toContain('<div><div></div></div>');
    }
    wrapper.unmount();
    Comment.prototype.componentWillUnmount = componentWillUnmount;
  });

  it('children of <Comment> will become empty strings if they are not of type string', () => {
    const wrapper = mount(
      <div>
        <Comment><div /></Comment>
      </div>
    );
    expect(wrapper.html()).toContain('<!---->');
  });
});
