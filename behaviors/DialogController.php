<?php namespace Prismify\Toolbox\Behaviors;

use Config;
use Backend;

use Backend\Classes\Controller;
use Backend\Classes\ControllerBehavior;

class DialogController extends ControllerBehavior
{
    const CREATE_FORM   = '$/prismify/toolbox/partials/dialogs/_template_create.htm';
    const UPDATE_FORM   = '$/prismify/toolbox/partials/dialogs/_template_update.htm';
    const PREVIEW_FORM  = '$/prismify/toolbox/partials/dialogs/_template_preview.htm';

    /**
     * @var Controller
     */
    protected $controller;

    /**
     * Behavior constructor
     *
     * @param   Controller  $controller
     */
    public function __construct($controller){

        parent::__construct($controller);

        $this->controller = $controller;

        $this->setConfig($controller->listConfig, ['modelClass']);

        $this->getToolboxAssets();
    }

    public function onCreateDialogRecordForm()
    {
        $this->controller->asExtension('FormController')->create();

        return $this->controller->makePartial(self::CREATE_FORM);
    }

    public function onCreateRecord()
    {
        $this->controller->asExtension('FormController')->create_onSave();
        $model = $this->controller->asExtension('FormController')->formCreateModelObject();

        return $this->controller->listRefresh();
    }

    public function onUpdateDialogRecordForm($record_id)
    {
        $this->controller->asExtension('FormController')->update($record_id);

        return $this->controller->makePartial(self::UPDATE_FORM);
    }

    public function onUpdateRecord($record_id)
    {
        $this->controller->asExtension('FormController')->update_onSave($record_id);

        return $this->controller->listRefresh();
    }

    public function onPreviewDialogRecordForm($record_id)
    {
        $this->controller->asExtension('FormController')->preview($record_id);

        return $this->controller->makePartial(self::PREVIEW_FORM);
    }

    public function onDeleteRecord($record_id)
    {
        $this->controller->asExtension('FormController')->update_onDelete($record_id);

        return $this->controller->listRefresh();
    }

    public function getToolboxAssets()
    {
        $this->addCss('/plugins/prismify/toolbox/assets/css/toolbox.css', 'Prismify.Toolbox');

        if (Config::get('develop.decompileBackendAssets', false)) {
            // Allow decompiled backend assets for Primsify.Toolbox
            $assets = Backend::decompileAsset('../../plugins/prismify/toolbox/assets/js/toolbox.js', true);

            foreach ($assets as $asset) {
                $this->addJs($asset, 'Prismify.Toolbox');
            }
        } else {
            $this->addJs('/plugins/prismify/toolbox/assets/js/toolbox-min.js', 'Prismify.Toolbox');
        }
    }
}
