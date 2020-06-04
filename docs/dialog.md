# Dialogs

Displays a modal dialog, based on the Bootstrap modal implementation.

- [Examples](#examples)
- [Remote dialogs](#remote-dialogs)
- [Controller dialogs](#controller-dialogs)
- [API documentation](#api-docs)

<a name="examples"></a>
## Examples

```html
    <a data-toggle="modal" href="#contentBasic" class="btn btn-primary btn-lg">Launch basic content</a>

    <div class="control-dialog dialog fade" id="contentBasic" tabindex="-1" role="dialog">
        <div class="dialog-container">
            <div class="dialog-content">
                <div class="dialog-body">
                    <button type="button" class="close" data-dismiss="dialog" aria-hidden="true">&times;</button>
                    <p>This is a very basic example of a dialog...</p>
                </div>
            </div>
        </div>
    </div>

    <a data-toggle="modal" href="#content-confirmation" class="btn btn-primary btn-lg">Launch Confirmation dialog</a>

    <div class="control-dialog dialog fade" id="content-confirmation" tabindex="-1" role="dialog">
        <div class="dialog-container">
            <div class="dialog-content">
                <div class="dialog-header">
                    <button type="button" class="close" data-dismiss="dialog" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Are you sure you wanna do that?</h4>
                </div>
                <div class="dialog-body">
                    <p>This is your last chance. After this, there is no turning back.</p>
                    <p>You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill - you stay in Wonderland, and I show you how deep the rabbit hole goes.</p>
                </div>
                <div class="dialog-footer">
                    <button type="button" class="btn btn-default" data-dismiss="dialog">Blue Pill</button>
                    <button type="button" class="btn btn-primary" data-dismiss="dialog">Red Pill</button>
                </div>
            </div>
        </div>
    </div>
```

<a name="remote-dialogs"></a>
## Remote dialogs

Content for the dialog can be loaded remotely using an AJAX request. Use the `data-handler` attribute to populate a dialog with the contents of an AJAX handler.

```html
<a
    data-control="dialog"
    data-handler="onLoadSomeContent"
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
    <div class="dialog-header">
        <button type="button" class="close" data-dismiss="dialog">&times;</button>
        <h4 class="dialog-title">
            <!-- Dialog header title goes here -->
            Send email
        </h4>
    </div>
    <div class="dialog-body">
        <!-- Any dialog content goes here -->
        <?= $this->customFormWidget->render() ?>
    </div>
    <div class="dialog-footer">
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

<a name="controller-dialogs"></a>
## Controller dialogs

#### Create Record
To create a record using the dialog, please follow these steps below:

###### Step 1
In your controller add `use Prismify\Toolbox\Behaviors\DialogController`:

```php
<?php namespace Acme\Formist\Controllers;

use Backend\Behaviors\FormController;
use Backend\Behaviors\ListController;
use BackendMenu;
use Backend\Classes\Controller;
use Prismify\Toolbox\Behaviors\DialogController;

/**
 * My Back-end Controller
 */
class MyController  extends Controller
{
    public $implement = [
        FormController::class,
        ListController::class,
        DialogController::class
    ];

    public $formConfig = 'config_form.yaml';
    public $listConfig = 'config_list.yaml';

    public $requiredPermissions = [];

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('Acme.Formist', 'formist', 'mycontroller');
    }
}
```

###### Step 2
In your controller `_list_toolbar.htm` add:

```html
<div data-control="toolbar">
    <button
        class="btn btn-primary oc-icon-plus"
        data-control="dialog"
        data-handler="onCreateRecordForm"
        data-extra-data="action: 'create'"
        data-size="md"
        data-mode="popup"
        data-stripe-load-indicator>
        Create some record
    </button>
</div>
```

###### Step 3
Click on the button to create a new record.

#### Update Record
To update a record using the dialog, please follow these steps below:

###### Step 1
In your controller `config_list.yaml` add:

```yaml
# ===================================
#  List Behavior Config
# ===================================

# Link URL for each record
# recordUrl: prismify/erp/departments/update/:id
recordOnClick: "$.dialog({ handler: 'onUpdateRecordForm', mode: 'popup', size: 'sm', extraData: {action:'update', record_id: ':id' } })"
```

###### Step 2
Click on a record from the list of existing ones to update it using the dialog popup.

#### Preview Record

To preview an existing record, please replace `handler: 'onUpdateRecordForm'` with `handler: 'onPreviewRecordForm'`, as well as `extraData: {action: 'update', record_id: ':id'}` with `extraData: {action: 'preview', record_id: ':id'}`.

<a name="api-docs"></a>
## API documentation

### Features:

- Supports nested relationships

### Options:
- content: content HTML string or callback

### Data attributes
- data-control="dialog" - enables the ajax dialog plugin
- data-ajax="dialog-content.htm" - ajax content to load
- data-handler="null" - October ajax request name, available requests:
    - `onCreateRecordForm()`
    - `onUpdateRecordForm()`
    - `onPreviewRecordForm()`
- data-keyboard="false" - Allow dialog to be closed with the keyboard
- data-extra-data="record_id: 1" - October ajax request data
- data-mode="null" - Dialog mode, available modes: 
    - `popup` (by default), 
    - `drawer`
- data-size="md" - Dialog size, available sizes: 
    - `xs`
    - `sm` 
    - `md` (by default)
    - `lg` 
    - `xl`
- data-position="left" - Dialog position, depends on data-mode="drawer", available position: 
    - `left` (by default)
    - `right`

### JavaScript API

```js
$('a#someLink').dialog({ ajax: 'dialog-content.htm' })
$('a#someLink').dialog({ handler: 'onLoadSomePopup' })
$('a#someLink').dialog({ handler: 'onLoadSomePopup', extraData: { record_id: 3 } })
$('a#someLink').dialog({ handler: 'onUpdateDialogRecordForm', extraData: { action:'update', record_id: 3 } })
$('a#someLink').dialog({ handler: 'onPreviewDialogRecordForm', extraData: { action:'preview', record_id: 3 } })
```
