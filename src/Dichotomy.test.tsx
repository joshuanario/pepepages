import React from 'react';
import { shallow } from 'enzyme';
import Dichotomy from './Dichotomy';

beforeEach(() => {
    jest.useFakeTimers()
})


it('renders a dichotomy', () =>{
    const toBe = 'to be'
    const ntobe = 'not to be'
    const mounting = 'mounting'
    const animating = 'animating'

    const pp = shallow(<Dichotomy firstText={toBe} secondText={ntobe} mountingClass={mounting} animatingClass={animating}/>)
    expect(pp.find('span').is('.'+mounting)).toBeTruthy()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    jest.runTimersToTime(3000)
    expect(pp.find('span').is('.'+mounting)).toBeFalsy()
    expect(pp.find('span').is('.'+animating)).toBeFalsy()
    expect(pp.text()).toEqual(toBe)
    pp.find('span').at(0).simulate('mouseEnter', {
        preventDefault: jest.fn(),
        currentTarget:{
            textContent: toBe
        }
    })
    expect(pp.find('span').is('.'+mounting)).toBeFalsy()
    expect(pp.find('span').is('.'+animating)).toBeTruthy()
    expect(pp.text()).toEqual(ntobe)
    jest.runTimersToTime(10000)
    expect(pp.find('span').is('.'+mounting)).toBeFalsy()
    expect(pp.find('span').is('.'+animating)).toBeFalsy()
    expect(pp.text()).toEqual(ntobe)
    pp.find('span').at(0).simulate('touchend', {
        preventDefault: jest.fn(),
        currentTarget:{
            textContent: ntobe
        }
    })
    expect(pp.find('span').is('.'+mounting)).toBeFalsy()
    expect(pp.find('span').is('.'+animating)).toBeTruthy()
    expect(pp.text()).toEqual(toBe)
})