import locale from 'locale';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

before(() => {
  return locale.load('en').then(() => {
    locale.setCurrent('en');
  });
});
