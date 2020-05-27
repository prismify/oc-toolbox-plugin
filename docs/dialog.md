# Dialogs

Displays a modal dialog, based on the Bootstrap modal implementation.

- [Examples](#examples)
- [Inline dialogs](#inline-dialogs)
- [Remote dialogs](#remote-dialogs)
- [API documentation](#api-docs)

<a name="examples"></a>
## Examples

    <a data-toggle="modal" href="#contentBasic" class="btn btn-primary btn-lg">Launch basic content</a>

    <div class="control-dialog modal fade" id="contentBasic" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <p>This is a very basic example of a dialog...</p>
                </div>
            </div>
        </div>
    </div>

    <a data-toggle="modal" href="#content-confirmation" class="btn btn-primary btn-lg">Launch Confirmation dialog</a>

    <div class="control-dialog modal fade" id="content-confirmation" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Are you sure you wanna do that?</h4>
                </div>
                <div class="modal-body">
                    <p>This is your last chance. After this, there is no turning back.</p>
                    <p>You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill - you stay in Wonderland, and I show you how deep the rabbit hole goes.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Blue Pill</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Red Pill</button>
                </div>
            </div>
        </div>
    </div>

<a name="inline-dialogs"></a>
## Inline dialogs

An inline dialog places the dialog content inside the current page, hidden from the view. For example, this container will not be visible on the page.

```html
<div class="control-dialog modal fade" id="contentBasic">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <p>This is a very basic example of a dialog...</p>
            </div>
        </div>
    </div>
</div>
```

Use the `data-toggle="modal"` HTML attribute to launch this container as a dialog.

```html
<a data-toggle="modal" href="#contentBasic" class="btn btn-primary btn-lg">
    Launch basic content
</a>
```

<a name="remote-dialogs"></a>
## Remote dialogs

Content for the dialog can be loaded remotely using an AJAX request. Use the `data-handler` attribute to populate a dialog with the contents of an AJAX handler.

```html
<a
    data-control="dialog"
    data-handler="onLoadContent"
    href="javascript:;"
    class="btn btn-primary btn-lg">
    Launch Ajax Form
</a>
```

Using the `data-ajax` attribute you can refer to an external file or URL directly.

```html
<a
    data-control="dialog"
    data-ajax="dialog-content.htm"
    href="javascript:;"
    class="btn btn-primary btn-lg">
    Launch Ajax Form
</a>
```

The partial for your rendered dialog should follow this structure:

```html
<div class="modal-header">
    <button type="button" class="close" data-dismiss="dialog">&times;</button>
    <h4 class="modal-title">
        <!-- Modal header title goes here -->
        Send email
    </h4>
</div>
<div class="modal-body">
    <!-- Any dialog content goes here -->
    <?= $this->customFormWidget->render() ?>
</div>
<div class="modal-footer">
    <!-- Dialog action buttons go here -->
    <button
        type="submit"
        class="btn btn-primary oc-icon-send"
        data-load-indicator="Sending">
        Send
    </button>
    <button
        type="button"
        class="btn btn-default"
        data-dismiss="dialog">
        <?= e(trans('backend::lang.relation.close')) ?>
    </button>
</div>
```

<a name="api-docs"></a>
## API documentation

### Options:
- content: content HTML string or callback

### Data attributes
- data-control="dialog" - enables the ajax dialog plugin
- data-ajax="dialog-content.htm" - ajax content to load
- data-handler="onLoadContent" - October ajax request name
- data-keyboard="false" - Allow dialog to be closed with the keyboard
- data-extra-data="file_id: 1" - October ajax request data
- data-size="large" - Dialog size, available sizes: giant, huge, large, small, tiny

### JavaScript API

```js
$('a#someLink').dialog({ ajax: 'dialog-content.htm' })
$('a#someLink').dialog({ handler: 'onLoadSomePopup' })
$('a#someLink').dialog({ handler: 'onLoadSomePopup', extraData: { record_id: 3 } })
$('a#someLink').dialog({ handler: 'onUpdateRecordForm', extraData: { action:'update', record_id: 3 } })
$('a#someLink').dialog({ handler: 'onPreviewRecordForm', extraData: { action:'preview', record_id: 3 } })
```
