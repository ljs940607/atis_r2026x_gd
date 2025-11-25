/*global define*/
define('DS/StuSound/StuSoundManagerNA', ['DS/StuSound/StuSoundManager', 'DS/StuCore/StuManager'], function (StuSoundManagerJS, Manager) {
    'use strict';


    /**
     * Process to execute when this STU.SoundManager is initializing.
     *
     * @method
     * @private
     */
    StuSoundManagerJS.prototype.onInitialize = function () {
        // we need to gather all the sound player so that we can set their sound to 0 in the sound engine directly, but also to keep a track of the volume (with the _volume)
        StuSoundManagerJS.prototype._listSoundPlayers = [];
        Manager.prototype.onInitialize.call(this);
    };

    /**
     * Process to execute when this STU.SoundManager is disposing.
     *
     * @method
     * @private
     */
    StuSoundManagerJS.prototype.onDispose = function () {
        StuSoundManagerJS.prototype._deleteAllSoundPlayer();
        Manager.prototype.onDispose.call(this);
    };


    StuSoundManagerJS.prototype.mute = function () {
        // to mute we go through all sound player, and set the engine to 0 (we keep the _volume so that we save info; +correct value if getVolume done by user, and can restore it later)
        let listPlayer = StuSoundManagerJS.prototype.getListSoundPlayers();
        for (let soundPlayer of listPlayer) {
            soundPlayer._sndSoundWrapper.setVolume(0.000001); //cant set it to 0, so i set to very smol
        }

        return true;
    };

    StuSoundManagerJS.prototype.unmute = function () {
        // restore the sound of the engine by re-setting the volume
        let listPlayer = StuSoundManagerJS.prototype.getListSoundPlayers();
        for (let soundPlayer of listPlayer) {
            soundPlayer._sndSoundWrapper.setVolume(soundPlayer._volume);
        }

        return true;
    };

    // we need to gather all the sound player so that we can set their sound to 0 in the sound engine directly, but also to keep a track of the volume (with the _volume)
    StuSoundManagerJS.prototype._listSoundPlayers = [];

    StuSoundManagerJS.prototype.getListSoundPlayers = function () {
        return StuSoundManagerJS.prototype._listSoundPlayers;
    };

    StuSoundManagerJS.prototype.registerSoundPlayer = function (player) {
        StuSoundManagerJS.prototype._listSoundPlayers.push(player);
    };

    StuSoundManagerJS.prototype._deleteAllSoundPlayer = function () {
        StuSoundManagerJS.prototype._listSoundPlayers.splice(0, StuSoundManagerJS.prototype._listSoundPlayers.length);
    };

    return StuSoundManagerJS;
});
