import * as React from 'react';
import { PureComponent } from 'react';
import classnames from 'classnames';
import { Tabs, ITabPanelElement, ITabPanelProps } from 'zent';

import Popover from '../../popover';
import { CascaderHandler, CascaderValue, ICascaderItem } from '../types';
import { II18nLocaleCascader } from '../../i18n';

const TabPanel = Tabs.TabPanel;
const withPopover = Popover.withPopover;

export interface ITabsContentProps {
  className?: string;
  clickHandler: CascaderHandler;
  value: CascaderValue[];
  options: ICascaderItem[];
  isLoading?: boolean;
  recursiveNextOptions(
    options: ICascaderItem[],
    value: CascaderValue
  ): ICascaderItem[];
  expandTrigger?: 'click' | 'hover';
  loadingStage: number;
  popover: Popover;
  activeId: number | string;
  onTabChange: (id: string | number) => void;
  title: React.ReactNode[];
  i18n: II18nLocaleCascader;
}

class TabsContent extends PureComponent<ITabsContentProps> {
  renderCascaderItems(items: ICascaderItem[], stage: number, popover: Popover) {
    const { value, clickHandler } = this.props;

    const cascaderItems = items.map(item => {
      const cascaderItemCls = classnames('zent-cascader__list-link', {
        'zent-cascader__list-link--active': item.id === value[stage - 1],
      });

      return (
        <div className="zent-cascader__list-item" key={item.id}>
          <span
            className={cascaderItemCls}
            title={item.title}
            onClick={() => clickHandler(item, stage, popover)}
          >
            {item.title}
          </span>
        </div>
      );
    });

    return <div className="zent-cascader__list">{cascaderItems}</div>;
  }

  renderTabTitle(title: React.ReactNode, stage: number) {
    const { isLoading, loadingStage } = this.props;

    if (isLoading && stage === loadingStage) {
      return (
        <div className="zent-cascader__loading">
          <div className="zent-cascader__loading-label">{title}</div>
          <div className="zent-cascader__loading-icon" />
        </div>
      );
    }

    return title;
  }

  renderPanels(popover: Popover, i18n: II18nLocaleCascader) {
    const PanelEls: Array<ITabPanelElement<
      ITabPanelProps<string | number>
    >> = [];
    let tabIndex = 1;
    let { title, options, value, recursiveNextOptions } = this.props;

    let tabTitle = i18n.title;

    title = Array.isArray(title) ? title : [];
    if (title.length > 0) {
      tabTitle = title[0];
    }

    PanelEls.push(
      <TabPanel
        tab={this.renderTabTitle(tabTitle, tabIndex)}
        id={tabIndex}
        key={tabIndex}
      >
        {this.renderCascaderItems(options, tabIndex, popover)}
      </TabPanel>
    );

    if (value && value.length > 0) {
      for (let i = 0; i < value.length; i++) {
        tabIndex++;
        options = recursiveNextOptions(options, value[i]);
        if (title.length >= tabIndex) {
          tabTitle = title[tabIndex - 1];
        } else {
          tabTitle = i18n.title;
        }
        if (options) {
          PanelEls.push(
            <TabPanel
              tab={this.renderTabTitle(tabTitle, tabIndex)}
              id={tabIndex}
              key={tabIndex}
            >
              {this.renderCascaderItems(options, tabIndex, popover)}
            </TabPanel>
          );
        }
      }
    }

    return PanelEls;
  }

  render() {
    const { activeId, popover, i18n, onTabChange } = this.props;
    return (
      <div className="zent-cascader__popup-inner">
        <Tabs
          activeId={activeId}
          onChange={onTabChange}
          type="card"
          className="zent-cascader__tabs"
        >
          {this.renderPanels(popover, i18n)}
        </Tabs>
      </div>
    );
  }
}

export default withPopover(
  TabsContent as React.ComponentType<ITabsContentProps>
);
