<?php namespace Prismify\Toolbox\Traits\Utilities;

use Carbon\Carbon;
use Illuminate\Support\Facades\Lang;
use October\Rain\Exception\ValidationException;

trait ModelUtilities
{
    //
    // Events
    //

    public function afterValidate()
    {
        if ($this->is_enabled && !$this->enabled_at) {
            throw new ValidationException([
                'enabled_at' => Lang::get('Please specific enabled date')
            ]);
        }
    }

    //
    // Scopes
    //

    public function scopeApplyEnabled($query)
    {
        return $query
            ->whereNotNull('is_enabled')
            ->where('is_enabled', true)
            ->whereNotNull('enabled_at')
            ->where('enabled_at', '<', Carbon::now())
            ;
    }
}