import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

console.error = jest.fn(error => {
  throw new Error(error);
});

configure({
  adapter: new Adapter(),
});
