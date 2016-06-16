'use strict';

import BattleshipApi from './util/BattleshipApi';
import Persistence from './util/Persistence';
import TitleScreenViewModel from "./viewmodel/TitleScreenViewModel";

(function () {

    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InNlZS5ncmFuZGlhQHN0dWRlbnQuYXZhbnMubmwi.DtPnllHeZKqv_lM7evo72TyJWpSOELFunRs4myKHMHA
    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI

    if (!Persistence.hasKey('token'))
        Persistence.set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI');

    let token = Persistence.get('token');
    let battleshipApi = new BattleshipApi(token);

    let titleVM = new TitleScreenViewModel(battleshipApi);
    titleVM.addTo('body');

}());


