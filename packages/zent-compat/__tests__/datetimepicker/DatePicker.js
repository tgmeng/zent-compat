import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import formatDate from 'zent/es/utils/date/formatDate';
import DatePicker from 'datetimepicker/DatePicker';
import { setTime, isSameDate } from 'datetimepicker/utils';

Enzyme.configure({ adapter: new Adapter() });
const HOURS = 10;
const MINUTES = 10;
const SECONDS = 10;

const TIME = '10:10:10';

describe('DateTimePicker', () => {
  it('DatePicker not show footer', () => {
    const wrapper = mount(<DatePicker />);
    wrapper.find('.picker-input').simulate('click');
    const pop = wrapper.find('.zent-popover');

    pop
      .find('.panel__cell')
      .at(1)
      .simulate('click');

    expect(wrapper.state('openPanel')).toBe(false);
    wrapper.unmount();
  });

  it('DatePicker has its default structure', () => {
    /**
     * .zent-datetime-picker
     *   .picker-wrapper
     *     .picker-input
     *       {palceholder||value}
     *       span.zenticon-calendar-o
     */
    const wrapper = mount(<DatePicker showTime isFooterVisible />);
    expect(wrapper.find('DatePicker').length).toBe(1);
    expect(wrapper.find('.picker-input').length).toBe(1);
    expect(wrapper.find('.zenticon').length).toBe(2);
    wrapper.find('.picker-input').simulate('click');
    wrapper.unmount();
  });

  it('DatePicker has its default behavior(DatePanel, MonthPanel and YearPanel 3 level transition)', () => {
    const wrapper = mount(<DatePicker isFooterVisible />);

    wrapper.find('.picker-input').simulate('click');
    // get pop from ref after simulate click.
    let pop = wrapper.find('.zent-popover');

    expect(pop.find('DatePanel').length).toBe(1);
    expect(pop.find('MonthPanel').length).toBe(0);
    expect(pop.find('YearPanel').length).toBe(0);
    pop.find('DatePanel .panel__title').simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('DatePanel').length).toBe(1);
    expect(pop.find('MonthPanel').length).toBe(1);
    expect(pop.find('YearPanel').length).toBe(0);
    pop.find('MonthPanel .panel__title').simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('DatePanel').length).toBe(1);
    expect(pop.find('MonthPanel').length).toBe(1);
    expect(pop.find('YearPanel').length).toBe(1);
    pop.find('YearPanel .panel__cell--current').simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('DatePanel').length).toBe(1);
    expect(pop.find('MonthPanel').length).toBe(1);
    expect(pop.find('YearPanel').length).toBe(0);
    pop.find('MonthPanel .panel__cell--current').simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('DatePanel').length).toBe(1);
    expect(pop.find('MonthPanel').length).toBe(0);
    expect(pop.find('YearPanel').length).toBe(0);
    pop.find('DatePanel .panel__cell--current').simulate('click');
    wrapper.unmount();
  });

  it('DatePicker with showTime switch (some kind of 5-level panel)', () => {
    const wrapper = mount(<DatePicker showTime />);
    wrapper.find('.picker-input').simulate('click');
    let pop = wrapper.find('.zent-popover');

    expect(pop.find('TimePanel .time__number').length).toBe(3);
    pop
      .find('TimePanel .time__number')
      .at(0)
      .simulate('click');

    pop = wrapper.find('.zent-popover');
    expect(pop.find('HourPanel .zenticon').length).toBe(1);
    pop.find('HourPanel .zenticon').simulate('click');
    pop
      .find('TimePanel .time__number')
      .at(1)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('MinutePanel').length).toBe(1);
    pop.find('MinutePanel .zenticon').simulate('click');
    pop
      .find('TimePanel .time__number')
      .at(2)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('SecondPanel').length).toBe(1);
    pop.find('SecondPanel .zenticon').simulate('click');
    pop
      .find('TimePanel .time__number')
      .at(0)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('HourPanel').length).toBe(1);
    pop.find('HourPanel .panel__cell--current').simulate('click');
    pop
      .find('TimePanel .time__number')
      .at(1)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('MinutePanel').length).toBe(1);
    pop.find('MinutePanel .panel__cell--current').simulate('click');
    pop
      .find('TimePanel .time__number')
      .at(2)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('SecondPanel').length).toBe(1);
    pop.find('SecondPanel .panel__cell--current').simulate('click');
    wrapper.unmount();
  });

  it('There are prev and next pager in Date/Month/YearPanel', () => {
    const getMonthNumber = string => +string.match(/\d{4}.{1}(\d{1,2})/)[1];
    const getYearNumber = string => +string.match(/(\d{4})/)[1];
    const getYearRangeTail = string => +string.match(/(\d{4}).*(\d{4})/)[2];
    const wrapper = mount(<DatePicker showTime isFooterVisible />);

    // DatePanel
    wrapper.find('.picker-input').simulate('click');
    let pop = wrapper.find('.zent-popover');

    expect(pop.find('DatePanel').length).toBe(1);
    pop
      .find('DatePanel .zenticon-right')
      .at(0)
      .simulate('click');
    let prev = getMonthNumber(pop.find('DatePanel .panel__title').text());
    pop
      .find('DatePanel .zenticon-right')
      .at(1)
      .simulate('click');
    let header = getMonthNumber(pop.find('DatePanel .panel__title').text());
    pop
      .find('DatePanel .zenticon-right')
      .at(1)
      .simulate('click');
    let next = getMonthNumber(pop.find('DatePanel .panel__title').text());
    if (header === 12) {
      expect(prev).toBe(11);
      expect(next).toBe(1);
    } else if (header === 1) {
      expect(prev).toBe(12);
      expect(next).toBe(2);
    } else {
      expect(header - prev).toBe(1);
      expect(header - next).toBe(-1);
    }

    // MonthPanel
    pop.find('DatePanel .panel__title').simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('MonthPanel').length).toBe(1);
    pop
      .find('MonthPanel .zenticon-right')
      .at(0)
      .simulate('click');
    prev = getYearNumber(pop.find('MonthPanel .panel__title').text());
    pop
      .find('MonthPanel .zenticon-right')
      .at(1)
      .simulate('click');
    header = getYearNumber(pop.find('MonthPanel .panel__title').text());
    pop
      .find('MonthPanel .zenticon-right')
      .at(1)
      .simulate('click');
    next = getYearNumber(pop.find('MonthPanel .panel__title').text());
    expect(header - prev).toBe(1);
    expect(next - header).toBe(1);

    // YearPanel
    pop.find('MonthPanel .panel__title').simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('YearPanel').length).toBe(1);
    pop
      .find('YearPanel .zenticon-right')
      .at(0)
      .simulate('click');
    prev = getYearRangeTail(pop.find('YearPanel .panel__title').text());
    pop
      .find('YearPanel .zenticon-right')
      .at(1)
      .simulate('click');
    header = getYearRangeTail(pop.find('YearPanel .panel__title').text());
    pop
      .find('YearPanel .zenticon-right')
      .at(1)
      .simulate('click');
    next = getYearRangeTail(pop.find('YearPanel .panel__title').text());
    expect(next - header).toBe(12);
    expect(header - prev).toBe(12);

    // HACK: branch with unused noop onClick
    pop.find('YearPanel .panel__title').simulate('click');
  });

  it('DatePicker is a controlled component', () => {
    let wrapper;
    const onChangeMock = jest.fn().mockImplementation(value => {
      wrapper.setProps({ value });
    });
    const hoverMock = jest.fn();
    wrapper = mount(
      <DatePicker
        value="2017-01-01"
        onChange={onChangeMock}
        onHover={hoverMock}
        isFooterVisible
      />
    );
    wrapper.find('.picker-input').simulate('click');
    const pop = wrapper.find('.zent-popover');

    // Today Button(only put the current selected and active)
    pop.find('PanelFooter .link--current').simulate('click');
    pop.find('PanelFooter .zent-btn').simulate('click');
    expect(onChangeMock.mock.calls.length).toBe(1);
    expect(wrapper.props().value).toBe(formatDate(new Date(), 'YYYY-MM-DD'));

    // click other date
    wrapper.find('.picker-input').simulate('click');
    pop
      .find('DatePanel .zenticon-right')
      .at(0)
      .simulate('click');
    pop
      .find('DatePanel .panel__cell')
      .at(1)
      .simulate('click');
    pop.find('PanelFooter .zent-btn').simulate('click');
    expect(onChangeMock.mock.calls.length).toBe(2);
    expect(pop.props().value).not.toBe(formatDate(new Date(), 'YYYY-MM-DD'));

    // hover event
    // BUG: onHover is not revealed
    wrapper.find('.picker-input').simulate('click');
    pop
      .find('DatePanel .panel__cell')
      .at(2)
      .simulate('mouseover');
    expect(hoverMock.mock.calls.length).toBe(0);
  });

  // HACK: branch description is not clear
  it('DatePicker will set actived to Date.now() when value prop is unable to parse', () => {
    let wrapper = mount(<DatePicker value="2001年9月11日" isFooterVisible />);
    expect(wrapper.find('DatePicker').state('actived') instanceof Date).toBe(
      true
    );

    wrapper = mount(<DatePicker isFooterVisible />);
    wrapper.setProps({ prefix: 'zent-custom' });
    expect(wrapper.find('.zent-custom-datetime-picker').length).toBe(1);
    wrapper.setProps({ value: false });
    expect(wrapper.find('DatePicker').state('value')).toBe(undefined);
    wrapper.setProps({ value: '2011-01-01' });
    wrapper.setProps({ format: null });

    wrapper.find('.picker-input').simulate('click');
    const pop = wrapper.find('.zent-popover');
    expect(pop.find('DatePanel').length).toBe(1);
  });

  it('DatePicker support value whose type is number or DateObj', () => {
    let pop;
    let wrapper;
    const changeValue = w => {
      w.find('.picker-input').simulate('click');
      pop = w.find('.zent-popover');
      pop.find('PanelFooter .link--current').simulate('click');
      pop.find('PanelFooter .zent-btn').simulate('click');
    };

    const onChangeMock = jest.fn().mockImplementation(value => {
      wrapper.setProps({ value });
    });
    wrapper = mount(
      <DatePicker
        onChange={onChangeMock}
        value={new Date(2017, 1, 1).getTime()}
        isFooterVisible
      />
    );
    changeValue(wrapper);
    expect(typeof onChangeMock.mock.calls[0][0]).toBe('number');
    wrapper = mount(
      <DatePicker onChange={onChangeMock} value={new Date()} isFooterVisible />
    );
    changeValue(wrapper);
    expect(onChangeMock.mock.calls[1][0] instanceof Date).toBe(true);
  });

  it('DatePicker has disable prop', () => {
    // total disable switch
    const getMonthNumber = string => +string.match(/\d{4}.{1}(\d{1,2})/)[1];
    const getYearNumber = string => +string.match(/(\d{4})/)[1];
    let wrapper = mount(<DatePicker disabled isFooterVisible />);
    expect(wrapper.find('DatePanel').length).toBe(0);
    wrapper.find('.picker-input').simulate('click');
    expect(wrapper.find('DatePanel').length).toBe(0);

    // disabledTime function
    const disFunc = val => {
      return val.getFullYear() > 2000;
    };
    wrapper = mount(<DatePicker disabledDate={disFunc} isFooterVisible />);
    wrapper.find('.picker-input').simulate('click');
    let pop = wrapper.find('.zent-popover');
    expect(pop.find('.panel__cell').every('.panel__cell--disabled')).toBe(true);

    // max
    const now = new Date();
    wrapper = mount(<DatePicker max="2010.01.01" isFooterVisible />);
    wrapper.find('.picker-input').simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(getMonthNumber(pop.find('DatePanel .panel__title').text())).toBe(
      now.getMonth() + 1
    );
    expect(getYearNumber(pop.find('DatePanel .panel__title').text())).toBe(
      now.getFullYear()
    );
    expect(pop.find('.panel__cell').every('.panel__cell--disabled')).toBe(true);

    // min
    wrapper.setProps({ min: '3000.01.01' });
    wrapper.find('.picker-input').simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(getMonthNumber(pop.find('DatePanel .panel__title').text())).toBe(
      now.getMonth() + 1
    );
    expect(getYearNumber(pop.find('DatePanel .panel__title').text())).toBe(
      now.getFullYear()
    );

    expect(pop.find('.panel__cell').every('.panel__cell--disabled')).toBe(true);

    // when disabled, the current link is hidden
    expect(pop.find('.link--current').length).toBe(0);
    pop.find('.zent-btn').simulate('click');
    expect(pop.find('DatePanel').length).toBe(1);
  });

  it('supports disabledTime callback', () => {
    const getDisabledTime = () => {
      return {
        disabledHour: () => false,
        disabledMinute: () => false,
        disabledSecond: () => false,
      };
    };
    const wrapper = mount(
      <DatePicker showTime disabledTime={getDisabledTime} isFooterVisible />
    );
    wrapper.find('.picker-input').simulate('click');
    let pop = wrapper.find('.zent-popover');
    expect(pop.find('TimePanel').length).toBe(1);

    pop
      .find('TimePanel .time__number')
      .first()
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('HourPanel').length).toBe(1);
    pop.find('HourPanel .link--prev').simulate('click');

    pop
      .find('TimePanel .time__number')
      .at(1)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('MinutePanel').length).toBe(1);
    pop.find('MinutePanel .link--prev').simulate('click');

    pop
      .find('TimePanel .time__number')
      .at(2)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('SecondPanel').length).toBe(1);
    pop.find('SecondPanel .link--prev').simulate('click');
  });

  it('support disabled time with min', () => {
    const now = setTime(new Date(), TIME);

    const wrapper = mount(<DatePicker showTime min={now} isFooterVisible />);
    wrapper.find('.picker-input').simulate('click');
    let pop = wrapper.find('.zent-popover');

    pop.find('DatePanel .panel__cell--current').simulate('click');
    pop
      .find('TimePanel .time__number')
      .first()
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(pop.find('SecondPanel').length).toBe(0);

    expect(
      pop
        .find('HourPanel .panel__cell')
        .at(HOURS - 1)
        .hasClass('panel__cell--disabled')
    ).toBe(true);

    pop
      .find('HourPanel .panel__cell')
      .at(HOURS)
      .simulate('click');

    pop
      .find('TimePanel .time__number')
      .at(1)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(
      pop
        .find('MinutePanel .panel__cell')
        .at(MINUTES - 1)
        .hasClass('panel__cell--disabled')
    ).toBe(true);

    pop
      .find('MinutePanel .panel__cell')
      .at(MINUTES)
      .simulate('click');
    pop
      .find('TimePanel .time__number')
      .at(2)
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(
      pop
        .find('SecondPanel .panel__cell')
        .at(SECONDS - 1)
        .hasClass('panel__cell--disabled')
    ).toBe(true);
  });

  it('support disabled time with max', () => {
    const now = setTime(new Date(), TIME);

    const wrapper = mount(<DatePicker showTime max={now} isFooterVisible />);
    wrapper.find('.picker-input').simulate('click');
    let pop = wrapper.find('.zent-popover');

    pop.find('DatePanel .panel__cell--current').simulate('click');
    pop
      .find('TimePanel .time__number')
      .first()
      .simulate('click');
    pop = wrapper.find('.zent-popover');
    expect(
      pop
        .find('HourPanel .panel__cell')
        .at(HOURS + 1)
        .hasClass('panel__cell--disabled')
    ).toBe(true);

    pop
      .find('HourPanel .panel__cell')
      .at(HOURS)
      .simulate('click');
    pop
      .find('TimePanel .time__number')
      .at(1)
      .simulate('click');
    pop = wrapper.find('.zent-popover');

    expect(
      pop
        .find('MinutePanel .panel__cell')
        .at(MINUTES + 1)
        .hasClass('panel__cell--disabled')
    ).toBe(true);

    pop
      .find('MinutePanel .panel__cell')
      .at(MINUTES)
      .simulate('click');
    pop
      .find('TimePanel .time__number')
      .at(2)
      .simulate('click');
    pop = wrapper.find('.zent-popover');

    expect(
      pop
        .find('SecondPanel .panel__cell')
        .at(SECONDS + 1)
        .hasClass('panel__cell--disabled')
    ).toBe(true);
  });

  it('support set actived date with defaultValue', () => {
    const today = new Date();
    const wrapper = mount(<DatePicker defaultValue={today} />);
    expect(isSameDate(wrapper.state('actived'), today)).toBe(true);
  });

  it('support set return value with valueType', () => {
    const valueType = 'number';
    const wrapper = mount(<DatePicker valueType={valueType} />);
    expect(wrapper.instance().retType).toBe(valueType);
  });

  it('support disabled clear input with onBeforeClear api', () => {
    const today = new Date();
    const wrapper = mount(
      <DatePicker onBeforeClear={() => false} value={today} />
    );
    wrapper.find('.picker-input .zenticon-close-circle').simulate('click');
    expect(isSameDate(wrapper.props().value, today)).toBe(true);
  });

  it('Support get actived date with getDate method', () => {
    const today = new Date();
    const wrapper = mount(<DatePicker value={today} />);
    expect(isSameDate(wrapper.instance().getDate(), today)).toBe(true);
  });
});
