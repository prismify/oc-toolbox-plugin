<?php namespace Prismify\Toolbox\Traits\Utilities;

use Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Lang;
use October\Rain\Exception\ValidationException;

trait ModelUtilities
{
    //
    // Getters
    //

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    //
    // Setters
    //



    //
    // Events
    //

    public function afterValidate()
    {
        if ($this->is_enabled && !$this->enabled_at) {
            throw new ValidationException([
                'enabled_at' => Lang::get('prismify.toolbox::lang.models.all.fields.enabled_at.validation')
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
            ->where('enabled_at', '<', Carbon::now());
    }

    //
    // Helpers
    //

    protected function lookupUser($user = null)
    {
        if (!$user)
            $user = Auth::getUser();

        if (!$user)
            return false;

        return $user;
    }

    protected function shortDecodeId($int)
    {
        return ((int) base_convert(str_rot13($int), 36, 10)) - 100;
    }

    protected function shortEncodeId($int)
    {
        return str_rot13(base_convert((int) $int + 100, 10, 36));
    }
}