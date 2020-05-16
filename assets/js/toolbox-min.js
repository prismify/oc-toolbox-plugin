
+function($){"use strict";var Base=$.oc.foundation.base,BaseProto=Base.prototype
var Drawer=function(element,options){this.options=options
this.$el=$(element)
this.$container=null
this.$modal=null
this.$backdrop=null
this.isOpen=false
this.isLoading=false
this.firstDiv=null
this.allowHide=true
this.$container=this.createDrawerContainer()
this.$content=this.$container.find('.drawer-content:first')
this.$dialog=this.$container.find('.drawer-dialog:first')
this.$modal=this.$container.modal({show:false,backdrop:false,keyboard:this.options.keyboard})
$.oc.foundation.controlUtils.markDisposable(element)
Base.call(this)
this.initEvents()
this.init()}
Drawer.prototype=Object.create(BaseProto)
Drawer.prototype.constructor=Drawer
Drawer.DEFAULTS={ajax:null,handler:null,keyboard:true,extraData:{},content:null,size:'md',position:'left',zIndex:null}
Drawer.prototype.init=function(){var self=this
if(self.isOpen)return
this.setBackdrop(true)
if(!this.options.content){this.setLoading(true)}
if(this.options.handler){this.$el.request(this.options.handler,{data:paramToObj('data-extra-data',this.options.extraData),success:function(data,textStatus,jqXHR){this.success(data,textStatus,jqXHR).done(function(){self.setContent(data.result)
$(window).trigger('ajaxUpdateComplete',[this,data,textStatus,jqXHR])
self.triggerEvent('complete.oc.drawer')})},error:function(jqXHR,textStatus,errorThrown){this.error(jqXHR,textStatus,errorThrown).done(function(){if(self.isLoading){self.hideLoading();}else{self.hide()}
self.triggerEvent('error.oc.drawer')})}})}
else if(this.options.ajax){$.ajax({url:this.options.ajax,data:paramToObj('data-extra-data',this.options.extraData),success:function(data){self.setContent(data)},cache:false})}
else if(this.options.content){var content=typeof this.options.content=='function'?this.options.content.call(this.$el[0],this):this.options.content
this.setContent(content)}}
Drawer.prototype.initEvents=function(){var self=this
this.$container.data('oc.drawer',this)
this.$modal.on('hide.bs.modal',function(){self.triggerEvent('hide.oc.drawer')
self.isOpen=false
self.setBackdrop(false)})
this.$modal.on('hidden.bs.modal',function(){self.triggerEvent('hidden.oc.drawer')
self.$container.remove()
$(document.body).removeClass('drawer-open')
self.dispose()})
this.$modal.on('show.bs.modal',function(){self.isOpen=true
self.setBackdrop(true)
$(document.body).addClass('drawer-open')})
this.$modal.on('shown.bs.modal',function(){self.triggerEvent('shown.oc.drawer')})
this.$modal.on('close.oc.drawer',function(){self.hide()
return false})}
Drawer.prototype.dispose=function(){this.$modal.off('hide.bs.modal')
this.$modal.off('hidden.bs.modal')
this.$modal.off('show.bs.modal')
this.$modal.off('shown.bs.modal')
this.$modal.off('close.oc.drawer')
this.$el.off('dispose-control',this.proxy(this.dispose))
this.$el.removeData('oc.drawer')
this.$container.removeData('oc.drawer')
this.$container=null
this.$content=null
this.$dialog=null
this.$modal=null
this.$el=null
this.options=null
BaseProto.dispose.call(this)}
Drawer.prototype.createDrawerContainer=function(){var modal=$('<div />').prop({class:'control-drawer drawer fade',role:'dialog',tabindex:-1}),modalDialog=$('<div />').addClass('drawer-dialog'),modalContent=$('<div />').addClass('drawer-content')
if(this.options.size)
modalDialog.addClass('drawer-size-'+this.options.size)
if(this.options.position)
modalDialog.addClass('drawer-position-'+this.options.position)
if(this.options.zIndex!==null)
modal.css('z-index',this.options.zIndex+20)
return modal.append(modalDialog.append(modalContent))}
Drawer.prototype.setContent=function(contents){this.$content.html(contents)
this.setLoading(false)
this.show()
this.firstDiv=this.$content.find('>div:first')
if(this.firstDiv.length>0)
this.firstDiv.data('oc.drawer',this)
var $defaultFocus=$('[default-focus]',this.$content)
if($defaultFocus.is(":visible")){window.setTimeout(function(){$defaultFocus.focus()
$defaultFocus=null},300)}}
Drawer.prototype.setBackdrop=function(val){if(val&&!this.$backdrop){this.$backdrop=$('<div class="drawer-backdrop fade" />')
if(this.options.zIndex!==null)
this.$backdrop.css('z-index',this.options.zIndex)
this.$backdrop.appendTo(document.body)
this.$backdrop.addClass('in')}
else if(!val&&this.$backdrop){this.$backdrop.remove()
this.$backdrop=null}}
Drawer.prototype.setLoading=function(val){if(!this.$backdrop)
return;this.isLoading=val
var self=this
if(val){setTimeout(function(){self.$backdrop.addClass('loading');},100)}
else{setTimeout(function(){self.$backdrop.removeClass('loading');},100)}}
Drawer.prototype.setShake=function(){var self=this
this.$content.addClass('drawer-shaking')
setTimeout(function(){self.$content.removeClass('drawer-shaking')},1000)}
Drawer.prototype.hideLoading=function(val){this.setLoading(false)
var self=this
setTimeout(function(){self.setBackdrop(false)},250)
setTimeout(function(){self.hide()},500)}
Drawer.prototype.triggerEvent=function(eventName,params){if(!params){params=[this.$el,this.$modal]}
var eventObject=jQuery.Event(eventName,{relatedTarget:this.$container.get(0)})
this.$el.trigger(eventObject,params)
if(this.firstDiv){this.firstDiv.trigger(eventObject,params)}}
Drawer.prototype.reload=function(){this.init()}
Drawer.prototype.show=function(){this.$modal.modal('show')
this.$modal.on('click.dismiss.drawer','[data-dismiss="drawer"]',$.proxy(this.hide,this))
this.triggerEvent('show.oc.drawer')
this.$dialog.css('transform','translate3d(0,0,0)')}
Drawer.prototype.hide=function(){if(!this.isOpen)return
this.triggerEvent('hide.oc.drawer')
if(this.allowHide)
this.$modal.modal('hide')
this.$dialog.css('transform','')}
Drawer.prototype.visible=function(val){if(val){this.$modal.addClass('in')}
else{this.$modal.removeClass('in')}
this.setBackdrop(val)}
Drawer.prototype.toggle=function(){this.triggerEvent('toggle.oc.drawer',[this.$modal])
this.$modal.modal('toggle')}
Drawer.prototype.lock=function(val){this.allowHide=!val}
var old=$.fn.drawer
$.fn.drawer=function(option){var args=Array.prototype.slice.call(arguments,1)
return this.each(function(){var $this=$(this)
var data=$this.data('oc.drawer')
var options=$.extend({},Drawer.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('oc.drawer',(data=new Drawer(this,options)))
else if(typeof option=='string')data[option].apply(data,args)
else data.reload()})}
$.fn.drawer.Constructor=Drawer
$.drawer=function(option){return $('<a />').drawer(option)}
$.fn.drawer.noConflict=function(){$.fn.drawer=old
return this}
function paramToObj(name,value){if(value===undefined)value=''
if(typeof value=='object')return value
try{return ocJSON("{"+value+"}")}
catch(e){throw new Error('Error parsing the '+name+' attribute value. '+e)}}
$(document).on('click.oc.drawer','[data-control="drawer"]',function(event){event.preventDefault()
$(this).drawer()});$(document).on('ajaxPromise','[data-drawer-load-indicator]',function(event,context){if($(this).data('request')!=context.handler)return
$(this).closest('.control-drawer').removeClass('in').drawer('setLoading',true)}).on('ajaxFail','[data-drawer-load-indicator]',function(event,context){if($(this).data('request')!=context.handler)return
$(this).closest('.control-drawer').addClass('in').drawer('setLoading',false).drawer('setShake')}).on('ajaxDone','[data-drawer-load-indicator]',function(event,context){if($(this).data('request')!=context.handler)return
$(this).closest('.control-drawer').drawer('hideLoading')})}(window.jQuery);