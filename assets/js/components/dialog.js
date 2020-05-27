/*
 * Ajax Dialog plugin
 *
 * Documentation: ../docs/dialog.md
 *
 * Require:
 *  - bootstrap/modal
 */

+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // DIALOG CLASS DEFINITION
    // ============================

    var Dialog = function(element, options) {
        this.options    = options
        this.$el        = $(element)
        this.$container = null
        this.$modal     = null
        this.$backdrop  = null
        this.isOpen     = false
        this.isLoading  = false
        this.firstDiv   = null
        this.allowHide  = true

        this.$container = this.createDialogContainer()
        this.$content = this.$container.find('.modal-content:first')
        this.$dialog = this.$container.find('.modal-dialog:first')
        this.$modal = this.$container.modal({ show: false, backdrop: false, keyboard: this.options.keyboard })

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)

        this.initEvents()
        this.init()
    }

    Dialog.prototype = Object.create(BaseProto)
    Dialog.prototype.constructor = Dialog

    Dialog.DEFAULTS = {
        ajax: null,
        handler: null,
        keyboard: true,
        extraData: {},
        content: null,
        size: null,
        adaptiveHeight: false,
        zIndex: null
    }

    Dialog.prototype.init = function(){
        var self = this

        /*
         * Do not allow the same dialog to open twice
         */
        if (self.isOpen) return

        /*
         * Show loading panel
         */
        this.setBackdrop(true)

        if (!this.options.content) {
            this.setLoading(true)
        }

        /*
         * October AJAX
         */
        if (this.options.handler) {
            var extraData = paramToObj('data-extra-data', this.options.extraData);
            if (extraData && extraData.action) {
                var url = window.location + "/" + extraData.action;
                if (extraData.action != 'create' && extraData.record_id) {
                    url += "/" + extraData.record_id;
                }
                window.history.pushState({}, "", url);
                self.pushedState = true;
            }

            this.$el.request(this.options.handler, {
                data: extraData,
                success: function(data, textStatus, jqXHR) {
                    this.success(data, textStatus, jqXHR).done(function(){
                        self.setContent(data.result)
                        $(window).trigger('ajaxUpdateComplete', [this, data, textStatus, jqXHR])
                        self.triggerEvent('dialogComplete') // Deprecated
                        self.triggerEvent('complete.oc.dialog')
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    this.error(jqXHR, textStatus, errorThrown).done(function(){
                        if (self.isLoading) {
                            self.hideLoading();
                        } else {
                            self.hide()
                        }
                        self.triggerEvent('dialogError') // Deprecated
                        self.triggerEvent('error.oc.dialog')
                    })
                }
            })

        }
        /*
         * Regular AJAX
         */
        else if (this.options.ajax) {

            $.ajax({
                url: this.options.ajax,
                data: paramToObj('data-extra-data', this.options.extraData),
                success: function(data) {
                    self.setContent(data)
                },
                cache: false
            })

        }
        /*
         * Specified content
         */
        else if (this.options.content) {

            var content = typeof this.options.content == 'function'
                ? this.options.content.call(this.$el[0], this)
                : this.options.content

            this.setContent(content)
        }
    }

    Dialog.prototype.initEvents = function(){
        var self = this

        /*
         * Duplicate the dialog reference on the .control-dialog container
         */
        this.$container.data('oc.dialog', this)

        /*
         * Hook in to BS Modal events
         */
        this.$modal.on('hide.bs.modal', function(){
            self.triggerEvent('hide.oc.dialog')
            self.isOpen = false
            self.setBackdrop(false)
        })

        this.$modal.on('hidden.bs.modal', function(){
            self.triggerEvent('hidden.oc.dialog')
            self.$container.remove()
            $(document.body).removeClass('modal-open')
            self.dispose()
        })

        this.$modal.on('show.bs.modal', function(){
            self.isOpen = true
            self.setBackdrop(true)
            $(document.body).addClass('modal-open')
        })

        this.$modal.on('shown.bs.modal', function(){
            self.triggerEvent('shown.oc.dialog')
        })

        this.$modal.on('close.oc.dialog', function(){
            self.hide()
            return false
        })
    }

    Dialog.prototype.dispose = function() {
        if (this.pushedState) {
            window.history.back();
        }
        this.$modal.off('hide.bs.modal')
        this.$modal.off('hidden.bs.modal')
        this.$modal.off('show.bs.modal')
        this.$modal.off('shown.bs.modal')
        this.$modal.off('close.oc.dialog')

        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.dialog')
        this.$container.removeData('oc.dialog')

        this.$container = null
        this.$content = null
        this.$dialog = null
        this.$modal = null
        this.$el = null

        // In some cases options could contain callbacks,
        // so it's better to clean them up too.
        this.options = null

        BaseProto.dispose.call(this)
    }

    Dialog.prototype.createDialogContainer = function() {
        var
            modal = $('<div />').prop({
                class: 'control-dialog modal fade',
                role: 'dialog',
                tabindex: -1
            }),
            modalDialog = $('<div />').addClass('modal-dialog'),
            modalContent = $('<div />').addClass('modal-content')

        if (this.options.size)
            modalDialog.addClass('size-' + this.options.size)

        if (this.options.adaptiveHeight)
            modalDialog.addClass('adaptive-height')

        if (this.options.zIndex !== null)
            modal.css('z-index', this.options.zIndex + 20)

        return modal.append(modalDialog.append(modalContent))
    }

    Dialog.prototype.setContent = function(contents) {
        this.$content.html(contents)
        this.setLoading(false)
        this.show()

        // Duplicate the dialog object reference on to the first div
        // inside the dialog. Eg: $('#firstDiv').dialog('hide')
        this.firstDiv = this.$content.find('>div:first')
        if (this.firstDiv.length > 0)
            this.firstDiv.data('oc.dialog', this)

        var $defaultFocus = $('[default-focus]', this.$content)
        if ($defaultFocus.is(":visible")) {
            window.setTimeout(function() {
                $defaultFocus.focus()
                $defaultFocus = null
            }, 300)
        }
    }

    Dialog.prototype.setBackdrop = function(val) {
        if (val && !this.$backdrop) {
            this.$backdrop = $('<div class="dialog-backdrop fade" />')

            if (this.options.zIndex !== null)
                this.$backdrop.css('z-index', this.options.zIndex)

            this.$backdrop.appendTo(document.body)

            this.$backdrop.addClass('in')
            this.$backdrop.append($('<div class="modal-content dialog-loading-indicator" />'))
        }
        else if (!val && this.$backdrop) {
            this.$backdrop.remove()
            this.$backdrop = null
        }
    }

    Dialog.prototype.setLoading = function(val) {
        if (!this.$backdrop)
            return;

        this.isLoading = val

        var self = this
        if (val) {
            setTimeout(function(){ self.$backdrop.addClass('loading'); }, 100)
        }
        else {
            setTimeout(function(){ self.$backdrop.removeClass('loading'); }, 100)
        }
    }

    Dialog.prototype.setShake = function() {
        var self = this

        this.$content.addClass('dialog-shaking')

        setTimeout(function() {
            self.$content.removeClass('dialog-shaking')
        }, 1000)
    }

    Dialog.prototype.hideLoading = function(val) {
        this.setLoading(false)

        // Wait for animations to complete
        var self = this
        setTimeout(function() { self.setBackdrop(false) }, 250)
        setTimeout(function() { self.hide() }, 500)
    }

    Dialog.prototype.triggerEvent = function(eventName, params) {
        if (!params) {
            params = [this.$el, this.$modal]
        }

        var eventObject = jQuery.Event(eventName, { relatedTarget: this.$container.get(0) })

        this.$el.trigger(eventObject, params)

        if (this.firstDiv) {
            this.firstDiv.trigger(eventObject, params)
        }
    }

    Dialog.prototype.reload = function() {
        this.init()
    }

    Dialog.prototype.show = function() {
        this.$modal.modal('show')

        this.$modal.on('click.dismiss.dialog', '[data-dismiss="dialog"]', $.proxy(this.hide, this))
        this.triggerEvent('dialogShow') // Deprecated
        this.triggerEvent('show.oc.dialog')

        // Fixes an issue where the Modal makes `position: fixed` elements relative to itself
        // https://github.com/twbs/bootstrap/issues/15856
        this.$dialog.css('transform', 'inherit')
    }

    Dialog.prototype.hide = function() {
        if (!this.isOpen) return

        this.triggerEvent('dialogHide') // Deprecated
        this.triggerEvent('hide.oc.dialog')

        if (this.allowHide)
            this.$modal.modal('hide')

        // Fixes an issue where the Modal makes `position: fixed` elements relative to itself
        // https://github.com/twbs/bootstrap/issues/15856
        this.$dialog.css('transform', '')
    }

    /*
     * Hide the dialog without destroying it,
     * you should call .hide() once finished
     */
    Dialog.prototype.visible = function(val) {
        if (val) {
            this.$modal.addClass('in')
        }
        else {
            this.$modal.removeClass('in')
        }
        this.setBackdrop(val)
    }

    Dialog.prototype.toggle = function() {
        this.triggerEvent('dialogToggle', [this.$modal]) // Deprecated
        this.triggerEvent('toggle.oc.dialog', [this.$modal])

        this.$modal.modal('toggle')
    }

    /*
     * Lock the dialog from closing
     */
    Dialog.prototype.lock = function(val) {
        this.allowHide = !val
    }

    // DIALOG PLUGIN DEFINITION
    // ============================

    var old = $.fn.dialog

    $.fn.dialog = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.dialog')
            var options = $.extend({}, Dialog.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.dialog', (data = new Dialog(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
            else data.reload()
        })
    }

    $.fn.dialog.Constructor = Dialog

    $.dialog = function (option) {
        return $('<a />').dialog(option)
    }

    // DIALOG NO CONFLICT
    // =================

    $.fn.dialog.noConflict = function () {
        $.fn.dialog = old
        return this
    }

    // DIALOG DATA-API
    // ===============

    function paramToObj(name, value) {
        if (value === undefined) value = ''
        if (typeof value == 'object') return value

        try {
            return ocJSON("{" + value + "}")
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e)
        }
    }

    $(document).on('click.oc.dialog', '[data-control="dialog"]', function(event) {
        event.preventDefault()

        $(this).dialog()
    });

    /*
     * Only use the dialog loading indicator if the handlers are an exact match.
     */
    $(document)
        .on('ajaxPromise', '[data-dialog-load-indicator]', function(event, context) {
            if ($(this).data('request') != context.handler) return
            $(this).closest('.control-dialog').removeClass('in').dialog('setLoading', true)
        })
        .on('ajaxFail', '[data-dialog-load-indicator]', function(event, context) {
            if ($(this).data('request') != context.handler) return
            $(this).closest('.control-dialog').addClass('in').dialog('setLoading', false).dialog('setShake')
        })
        .on('ajaxDone', '[data-dialog-load-indicator]', function(event, context) {
            if ($(this).data('request') != context.handler) return
            $(this).closest('.control-dialog').dialog('hideLoading')
        })

}(window.jQuery);
