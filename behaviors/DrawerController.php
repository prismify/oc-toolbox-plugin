<?php namespace Prismify\Toolbox\Behaviors;

use Backend\Helpers\Backend;
use October\Rain\Support\Facades\Config;
use Backend\Classes\Controller;
use Backend\Classes\ControllerBehavior;

class DrawerController extends ControllerBehavior
{
    const CREATE_FORM   = '$/prismify/toolbox/partials/drawers/_template_create.htm';
    const UPDATE_FORM   = '$/prismify/toolbox/partials/drawers/_template_update.htm';
    const PREVIEW_FORM  = '$/prismify/toolbox/partials/drawers/_template_preview.htm';

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

    public function onCreateRecordForm()
    {
        $this->controller->asExtension('FormController')->create(post('record_id'));
        $this->controller->vars['recordId'] = post('record_id');

        return $this->controller->makePartial(self::CREATE_FORM);
    }

    public function onCreateRecord()
    {
        $this->controller->asExtension('FormController')->create_onSave();
        $model = $this->controller->asExtension('FormController')->formCreateModelObject();

        return $this->controller->listRefresh();
    }

    public function onUpdateRecordForm()
    {
        $this->controller->asExtension('FormController')->update(post('record_id'));
        $this->controller->vars['recordId'] = post('record_id');

        return $this->controller->makePartial(self::UPDATE_FORM);
    }

    public function onUpdateRecord()
    {
        $this->controller->asExtension('FormController')->update_onSave(post('record_id'));

        return $this->controller->listRefresh();
    }

    public function onPreviewRecordForm()
    {
        $this->controller->asExtension('FormController')->preview(post('record_id'));
        $this->controller->vars['recordId'] = post('record_id');

        return $this->controller->makePartial(self::PREVIEW_FORM);
    }

    public function onDeleteRecord()
    {
        $this->controller->asExtension('FormController')->update_onDelete(post('record_id'));

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