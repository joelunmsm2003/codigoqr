import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


	scanSub:any;

  constructor(private qrScanner: QRScanner,public navCtrl: NavController) {





 

  }



   ionViewDidLoad(){

   	  	window.document.querySelector('ion-app').classList.add('transparentBody')

	this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted

       alert('Autorizado....')
       // start scanning
       this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
         alert('Scanned something'+ text);


       });

       this.qrScanner.hide(); // hide camera preview
	   this.scanSub.unsubscribe(); // stop scanning


     } else if (status.denied) {

       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there

     } else {

         // permission was denied, but not permanently. You can ask for permission again at a later time.

	     }

	 })

	 .catch((e: any) => console.log('Error is', e));
   }




  	ionViewDidLeave() {

    //window.document.querySelector('ion-app').classList.remove('transparentBody')
  }








 

leer(){

	alert('Entre...')

	window.document.querySelector('ion-app').classList.add('transparentBody')




	//this.qrScanner.show();

	this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted

       alert('Autorizado....')
       // start scanning
       this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
         alert('Scanned something'+ text);

			this.qrScanner.hide(); // hide camera preview
			this.scanSub.unsubscribe(); // stop scanning

       });


     } else if (status.denied) {

       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there

     } else {

         // permission was denied, but not permanently. You can ask for permission again at a later time.

	     }

	 })

	 .catch((e: any) => console.log('Error is', e));



  // Optionally request the permission early
}

}
