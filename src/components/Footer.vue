<template>
    <div>
        <div class="is-pc-footer"
        style = "width:100%; height:300px; background-color:#1E88E5;"
        >
            <div class="flex logo-style">
                <div>
                    <g-image src="../img/logo.png"></g-image>
                </div>
            </div>
            <div style = "width:100%; height:100px; text-align:center; font-size:14px; color:white; font-weight:300; line-height:50px; padding-top:20px;">
                <div>Copyright © 2017 uEngine &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; All Rights Reserved &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; Designed By Sppark &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; Address, Room 501 of the 18ju-il Building, Sinbanpo 45-gil, Seocho-gu, Seoul.</div>
                <div>Email : help@uengine.org</div>
            </div>
        </div>
            <!-- 모바일 footer -->
        <div 
        style = "width:100%; height:300px; background-color:#1E88E5;"
        class="is-mobile-footer"
        >
            <div class="flex logo-style">
                <div>
                    <g-image style="display:block;" src="../img/logo.png"></g-image>
                </div>
            </div>
            <div style = "width:100%; height:100px; text-align:center; font-size:14px; color:white; font-weight:300; line-height:30px; padding-top:20px;">
                <div>Copyright © 2017 uEngine <br> All Rights Reserved <br> Designed By Sppark <br> Address, Room 501 of the 18ju-il Building, Sinbanpo 45-gil, Seocho-gu, Seoul.</div>
                <div>Email : help@uengine.org</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.logo-style{
  width:10%; margin-left:45%;  padding-top:30px;
}
.is-mobile-footer{display:none;}
@media only screen and (max-width:1279px) {
    .logo-style{
      width:15%; margin-left:42.5%;  padding-top:30px;
    }
    .is-mobile-footer{display:block;}
    .is-pc-footer{display:none;}
  }
</style>