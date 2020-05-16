# Drawers
Displays a left side or right side drawer, based on the Bootstrap modal implementation.

# Remote drawers

Content for the drawer can be loaded remotely using an AJAX request. Use the `data-handler` attribute to populate a drawer with the contents of an AJAX handler.

```
    <a
        data-control="drawer"
        data-handler="onCreateRecordForm"
        href="javascript:;"
        class="btn btn-primary btn-lg">
        Create some record
    </a>
```

Using the `data-ajax` attribute you can refer to an external file or URL directly.

```
    <a
        data-control="drawer"
        data-ajax="drawer-content.htm"
        href="javascript:;"
        class="btn btn-primary btn-lg">
        Launch Ajax Form
    </a>
```

# API documentation

Options:

- content: content HTML string or callback

Data attributes:

- data-control="drawer" - enables the ajax drawer plugin
- data-ajax="null" - ajax content to load
- data-handler="null" - October ajax request name, available handlers: onCreateRecordForm, onUpdateRecordForm, onPreviewRecordForm
- data-keyboard="true" - Allow drawer to be closed with the keyboard
- data-extra-data="file_id: 1" - October ajax request data
- data-size="md" - Drawer size, available sizes: xs, sm, md, lg, xl
- data-position="left" - Drawer position, available position: left, right

# JavaScript API

```
    $('a#someLink').drawer({ ajax: 'drawer-content.htm' })
    $('a#someLink').drawer({ handler: 'onLoadSomeDrawer' })
    $('a#someLink').drawer({ handler: 'onLoadSomeDrawer', extraData: { id: 3 } })
```