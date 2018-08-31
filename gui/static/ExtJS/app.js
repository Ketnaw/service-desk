Ext.application({
    name: 'serviceDesk',
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'grid',
                name: 'incidentGrid',
                tbar: [{
                    xtype: 'button',
                    text: 'Добавить',
                    handler: function(){
                        var wnd = Ext.create('Ext.window.Window', {
                            width: 900,
                            title: 'Добавить обращение',
                            name: 'addIncidentWnd',
                            gridLnk: this,
                            items: [{
                                xtype: 'form',
                                name: 'addFrm',
                                bbar: ['->', {
                                    xtype: 'button',
                                    text: 'Добавить',
                                    handler: function(){
                                        var formPanel = this.up('panel[name=addFrm]')
                                        if(formPanel){
                                            if(formPanel.isValid()){
                                                var operator = formPanel.down('[name=operator]').getValue()
                                                var initMail = formPanel.down('[name=initMail]').getValue()
                                                var mailMask = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                if(!mailMask.test(initMail.toLowerCase())){
                                                    Ext.Msg.alert('Ошибка', 'Не корректно заполнено поле e-mail', Ext.emptyFn);
                                                    return
                                                }
                                                var initPhone = formPanel.down('[name=initPhone]').getValue()
                                                if (initPhone.toString().match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) === null){
                                                    Ext.Msg.alert('Ошибка', 'Не корректно заполнено поле телефон', Ext.emptyFn);
                                                    return;
                                                }
                                                var initText = formPanel.down('[name=initText]').getValue()
                                                Ext.Ajax.request({
                                                    scope: this,
                                                    url: 'api/addIncident/',
                                                    method: 'POST',
                                                    params: {
                                                        operator: operator,
                                                        initiatorMail: initMail,
                                                        initiatorPhone: initPhone,
                                                        incidentText: initText
                                                    },
                                                    success: function(response, opts) {
                                                        var gridLnk = this.up('[name=addIncidentWnd]').gridLnk
                                                        if(gridLnk){
                                                            var store = gridLnk.up('grid').getStore()
                                                            store.load()
                                                            var wnd = this.up('[name=addIncidentWnd]').close()
                                                        }
                                                    }
                                                })
                                            }else{
                                                Ext.Msg.alert('Ошибка', 'Не заполнены поля', Ext.emptyFn);
                                            }
                                        }
                                    }
                                }],
                                items: [
                                    {
                                        xtype: 'fieldset',
                                        title: 'Ответственный',
                                        cls: 'check-field-set',
                                        defaultType: 'textfield',
                                        layout: 'anchor',
                                        defaults: {
                                            anchor: '100%',
                                            padding: '10'
                                        },
                                        items: [{
                                            xtype: 'textfield',
                                            name: 'operator',
                                            flex: 1,
                                            emptyText: 'Введите логин оператора',
                                            allowBlank: false,
                                            hideLabel: true
                                        }]
                                    },
                                    {
                                        xtype: 'fieldset',
                                        title: 'Инцидент',
                                        cls: 'check-field-set',
                                        defaultType: 'textfield',
                                        layout: 'anchor',
                                        defaults: {
                                            anchor: '100%',
                                            padding: '10'
                                        },
                                        items: [{
                                                name: 'initMail',
                                                flex: 1,
                                                emptyText: 'Введите e-mail инициатора',
                                                allowBlank: false
                                            },{
                                                name: 'initPhone',
                                                flex: 1,
                                                emptyText: 'Введите телефон инициатора',
                                                allowBlank: false
                                            },{
                                                xtype: 'textareafield',
                                                name: 'initText',
                                                flex: 1,
                                                emptyText: 'Введите описание инцидента',
                                                allowBlank: false
                                            }
                                        ]
                                    }
                                ]
                            }]
                        })
                        wnd.show();
                    }
                }],
                columns: [
                    {text: 'ID', width: 110, dataIndex: 'incidentId'},
                    {text: 'Дата/время', width: 110, dataIndex: 'loadDtm'},
                    {text: 'Оператор', width: 150, dataIndex: 'operator'},
                    {text: 'email', width: 170, dataIndex: 'initiatorMail'},
                    {text: 'Телефон', width: 120, dataIndex: 'initiatorPhone'},
                    {text: 'Статус', width: 70, dataIndex: 'incidentStatus',
                        renderer: function(val){
                            switch(val){
                                case '1':
                                    val = 'Новая'
                                    break
                                case '2':
                                    val = 'В работе'
                                    break
                                case '3':
                                    val = 'Выполнена'
                                    break
                                case '4':
                                    val = 'Отклонена'
                                    break
                            }
                            return val
                        }
                    },
                    {text: 'Текст', flex: 2, dataIndex: 'incidentText'},
                    {text: 'Комментарий', flex: 1, dataIndex: 'serviceText'}
                ],
                store: Ext.create('Ext.data.Store',{
                    autoLoad: true,
                    proxy: {
                        type: 'ajax',
                        url: 'api/incident'
                    }
                }),
                listeners: {
                    scope: this,
                    itemcontextmenu: function(view, rec, node, index, e){
                        e.stopEvent();
                        var items = [];
                        curStep = rec.get('incidentStatus')
                        recId = rec.get('incidentId')
                        nextStep = 0
                        nextDescr = ''
                        items.push({
                            text:'Комментарий',
                            recId: recId,
                            handler: function(){
                                var wnd = Ext.create('Ext.window.Window', {
                                    height: 200,
                                    width: 600,
                                    recId: recId,
                                    title: 'Добавить комментарий',
                                    layout: 'fit',
                                    items: [{
                                        xtype: 'textareafield',
                                        flex: 1,
                                        name: 'serviceComment'
                                    }],
                                    buttons: [{
                                        text: 'Добавить',
                                        handler: function(){
                                            debugger
                                            var comment = this.up('window').down('[name=serviceComment]').getValue()
                                            var recId = this.up('window').recId
                                            Ext.Ajax.request({
                                                scope: this,
                                                url: 'api/editIncident/',
                                                method: 'POST',
                                                params: {
                                                    recId: recId,
                                                    serviceComment: comment
                                                },
                                                success: function(response, opts) {
                                                    var grid = Ext.ComponentQuery.query('[name=incidentGrid]')[0]
                                                    if(grid){
                                                        grid.getStore().load()
                                                    }
                                                }
                                            })
                                        }
                                    }]
                                })
                                wnd.show()
                            }
                        })
                        switch(curStep){
                            case '1':
                                items.push({text:'В работе', recId: recId,
                                    handler: function(){
                                        this.up('menu').updateRow(recId, 2)
                                    }})
                                items.push({text:'Выполнено', recId: recId,
                                    handler: function(){
                                        this.up('menu').updateRow(recId, 3)
                                    }})
                                items.push({text:'Отказано', recId: recId,
                                    handler: function(){
                                        this.up('menu').updateRow(recId, 4)
                                    }})
                                break
                            case '2':
                                items.push({text:'Выполнено', recId: recId,
                                    handler: function(){
                                        this.up('menu').updateRow(recId, 3)
                                    }})
                                items.push({text:'Отказано', recId: recId,
                                    handler: function(){
                                        this.up('menu').updateRow(recId, 4)
                                    }})
                                break
                        }
                        var contextMenu = new Ext.menu.Menu({
                            items: items, 
                            updateRow: function(recId, statusId){
                                Ext.Ajax.request({
                                    scope: this,
                                    url: 'api/editIncident/',
                                    method: 'POST',
                                    params: {
                                        recId: recId,
                                        statusId: statusId
                                    },
                                    success: function(response, opts) {
                                        var grid = Ext.ComponentQuery.query('[name=incidentGrid]')[0]
                                        if(grid){
                                            grid.getStore().load()
                                        }
                                    }
                                })
                            }
                        });
                        var position = [e.getX(), e.getY()];
                        contextMenu.showAt(position);
                        return false;
                    }
                }
            }]
        });
    }
});
