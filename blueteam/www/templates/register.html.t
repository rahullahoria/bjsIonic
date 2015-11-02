<ion-view view-title="Welcome to BlueTeam">
 <ion-content>
 <div class="card ">
     <center><img ng-src="img/ms-icon-70x70.png" class="img-rounded" style="max-width: 100%;" ></center>
     </div>
<div class="card">
    
    <form ng-submit="regUser()">
      <label class="item item-input item-stacked-label">
        <span class="input-label">Full Name</span>
        <input type="text" name="name" 
                        placeholder="enter full name" ng-model="data.name" ng-minlength="5" required>
      </label>

      <label class="item item-input item-stacked-label">
        <span class="input-label">Mobile No.</span>
        <input type="number" name="mobile" 
                        placeholder="enter mobile no." ng-model="data.mobile" ng-minlength="10" required>
      </label>


   <input class="button button-block button-positive" 
                    type="submit" name="submit" value="Go Blue"> 

   </form>
   </div>
  </ion-content>
</ion-view>
