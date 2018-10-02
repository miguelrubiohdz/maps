@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h3 class="panel-title">Selected</h3>
                                </div>
                                <div class="panel-body">
                                    <p>Id: <span ng-bind="selected.id"></span></p>
                                    <p>Location: <span ng-bind="selected.lat"></span>,<span ng-bind="selected.lng"></span></p>
                                    <p>Defensive Troops: <span ng-bind="selected.defTroops"></span>
                                        <span ng-if="selected.userDefTroops > 0">(<%selected.userDefTroops%>)</span></p>
                                    <p>Attacking Troops: <span ng-bind="selected.attTroops"></span>
                                    <span ng-if="selected.userAttTroops > 0">(<%selected.userAttTroops%>)</span></p></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h3 class="panel-title">Move armies</h3>
                                </div>
                                <div class="panel-body">
                                    <form>
                                        From <input class="form-control" type="number" ng-model="moveFrom">
                                        To <input class="form-control" type="number" ng-model="moveTo">
                                        Quantity <input class="form-control" type="number" ng-model="moveQty">
                                        <input class="btn btn-default" type="button" value="Move" ng-click="moveArmies()">
                                    </form>
                                </div>
                            </div>
                    </div>
                    </div>
                    <div id="map"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--create zones overlays ->
<div  class="troop-wrapper" class="hidden">
    <div id="p<%zone.id%>" class="troops" ng-repeat="zone in zones">
        <p class="def">
            <span class="badge badge-white map-overlay"><%zone.defArmy%></span>
        </p>
        <p class="att">
            <span class="badge badge-white map-overlay"><%zone.attArmy%></span>
        </p>
    </div>
</div>-->
<input type="hidden" id="user_id" value="{{ Auth::user()->id }}">
<div  class="troop-wrapper" class="hidden">
    <div id="p<%zone.id%>" class="troops" ng-repeat="zone in zones">
        <!--p>
            <span class="map-overlay"><%zone.defTroops%> <span ng-if="zone.userDefTroops > 0">(<%zone.userDefTroops%>)</span> / <%zone.attTroops%> <span ng-if="zone.userAttTroops > 0">(<%zone.userAttTroops%>)</span></span>
        </p-->
        <p style="height:100%; width:100%; font-size:22px; text-align:center; vertical-align:middle;">
            <%zone.defTroops%>
        <p>
    </div>
</div>

@endsection
