import * as m from 'mithril';
import ParentComponent from '../ParentComponent';
import { ViewModelStatus } from '../../Enums';
import MainLayoutComponent from '../MainLayoutComponent';
import factory from '../../ViewModel/ViewModelFactory';
import SettingViewModel from '../../ViewModel/Setting/SettingViewModel';
import Util from '../../Util/Util';

/**
* SettingComponent
*/
class SettingComponent extends ParentComponent<void> {
    private viewModel: SettingViewModel;

    constructor() {
        super();
        this.viewModel = <SettingViewModel>(factory.get('SettingViewModel'));
    }

    protected initViewModel(status: ViewModelStatus = 'init'): void {
        super.initViewModel(status);
        if(status === 'init') {
            this.viewModel.setTemp();
        }
    }

    /**
    * page name
    */
    protected getComponentName(): string { return 'Setting'; }

    /**
    * view
    */
    public view(): m.Child {
        return m(MainLayoutComponent, {
            header: { title: '設定' },
            content: [
                this.createContent(),
            ],
        });
    }

    /**
    * create content
    * @return m.Child
    */
    public createContent(): m.Child {
        let buttonHover = Util.uaIsMobile() ? ' no-hover' : '';

        let fixScroll: m.Child | null = null;
        if(Util.uaIsAndroid()) {
            fixScroll = this.createListItem(
                '番組表スクロール修正',
                m('label', {
                    class: 'mdl-switch mdl-js-switch mdl-js-ripple-effect',
                    onupdate: (vnode: m.VnodeDOM<void, this>) => {
                        this.toggleLabelOnUpdate(<HTMLInputElement>vnode.dom, this.viewModel.tmpValue.programFixScroll);
                    }
                }, [
                    m('input', {
                        type: 'checkbox',
                        class: 'mdl-switch__input',
                        checked: this.viewModel.tmpValue.programFixScroll,
                        onclick: m.withAttr('checked', (value) => {
                            this.viewModel.tmpValue.programFixScroll = value;
                        }),
                    }),
                ]),
                { style: 'margin-right: 16px;' }
            );
        }

        return m('div', { class : 'setting-content mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col' }, [
            m('ul', { class: 'mdl-list' }, [
                fixScroll,

                this.createListItem(
                    '番組表時間',
                    m('div', { class: 'pulldown mdl-layout-spacer' }, [
                        m('select', {
                            class: 'mdl-textfield__input program-dialog-label',
                            onchange: m.withAttr('value', (value) => {
                                this.viewModel.tmpValue.programLength = Number(value);
                            }),
                            onupdate: (vnode: m.VnodeDOM<void, this>) => {
                                this.selectOnUpdate(<HTMLInputElement>(vnode.dom), this.viewModel.tmpValue.programLength);
                            },
                        }, this.createLengthOption(24))
                    ])
                ),

                this.createListItem(
                    '録画番組表示件数',
                    m('div', { class: 'pulldown mdl-layout-spacer' }, [
                        m('select', {
                            class: 'mdl-textfield__input program-dialog-label',
                            onchange: m.withAttr('value', (value) => {
                                this.viewModel.tmpValue.recordedLength = Number(value);
                            }),
                            onupdate: (vnode: m.VnodeDOM<void, this>) => {
                                this.selectOnUpdate(<HTMLInputElement>(vnode.dom), this.viewModel.tmpValue.recordedLength);
                            },
                        }, this.createLengthOption())
                    ])
                ),

                this.createListItem(
                    '予約表示件数',
                    m('div', { class: 'pulldown mdl-layout-spacer' }, [
                        m('select', {
                            class: 'mdl-textfield__input program-dialog-label',
                            onchange: m.withAttr('value', (value) => {
                                this.viewModel.tmpValue.reservesLength = Number(value);
                            }),
                            onupdate: (vnode: m.VnodeDOM<void, this>) => {
                                this.selectOnUpdate(<HTMLInputElement>(vnode.dom), this.viewModel.tmpValue.reservesLength);
                            },
                        }, this.createLengthOption())
                    ])
                ),

                this.createListItem(
                    'ルール表示件数',
                    m('div', { class: 'pulldown mdl-layout-spacer' }, [
                        m('select', {
                            class: 'mdl-textfield__input program-dialog-label',
                            onchange: m.withAttr('value', (value) => {
                                this.viewModel.tmpValue.ruleLength = Number(value);
                            }),
                            onupdate: (vnode: m.VnodeDOM<void, this>) => {
                                this.selectOnUpdate(<HTMLInputElement>(vnode.dom), this.viewModel.tmpValue.ruleLength);
                            },
                        }, this.createLengthOption())
                    ])
                ),

            ]),

            m('div', { class: 'mdl-dialog__actions' }, [
                m('button', {
                    type: 'button',
                    class: 'mdl-button mdl-js-button mdl-button--primary' + buttonHover,
                    onclick: () => { this.viewModel.save(); }
                }, '保存'),

                m('button', {
                    type: 'button',
                    class: 'mdl-button mdl-js-button mdl-button--accent close' + buttonHover,
                    onclick: () => { this.viewModel.reset(); },
                }, 'リセット'),
            ]),
        ]);
    }

    /**
    * create list item
    * @param name: name
    * @param child m.child
    * @param child Attr: attr
    * @return m.Child
    */
    private createListItem(name: string, child: m.Child, childAttr: { [key: string]: any } = {}): m.Child {
        if(typeof childAttr.class === 'string') {
            childAttr.class += ' mdl-list__item-secondary-action';
        } else {
            childAttr.class = 'mdl-list__item-secondary-action';
        }

        return m('li', { class: 'mdl-list__item' }, [
            m('span', { class: 'mdl-list__item-primary-content' }, name),
            m('span', childAttr, child),
        ]);
    }

    /**
    * create length option
    * @param maxValue: number
    * @return m.Child[]
    */
    private createLengthOption(maxValue: number = 50): m.Child[] {
        let results: m.Child[] = [];

        for(let i = 1; i <= maxValue; i++) {
            results.push(m('option', { value: i }, i));
        }

        return results;
    }
}

export default SettingComponent;
