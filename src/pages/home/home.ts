import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Storage } from '@ionic/storage';
import { Http,RequestOptions, Headers } from '@angular/http';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


	scanSub:any;
  user:any={}

  obras:any=[]

  constructor(public http: Http,public storage: Storage,private qrScanner: QRScanner,public navCtrl: NavController) {}


  ionViewDidLoad() {

     
     this.http.get('http://mylookxpressapp.com:8000/publicidad')
     .subscribe(
      data => {

          console.log(JSON.parse(data['_body']))

          this.obras=data['_body']

      }),

      error => {

      }


  }


  ingresar(user){

   
    this.storage.set('user',user)

    this.storage.get('user').then((val) => { console.log(val)});






    //this.http.get('http://mylookxpress.com:8000/publicidad').then((response: Response) => <Foto[]> response.json())

  }






iniciar(){



  window.document.querySelector('ion-app').classList.add('transparentBody')

  //this.qrScanner.show();

  this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
     if (status.authorized) {
     
       // start scanning
       this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
        

       });


      this.qrScanner.hide(); // hide camera preview
      this.scanSub.unsubscribe(); // stop scanning



     } 

   })

   .catch((e: any) => console.log('Error is', e));



  // Optionally request the permission early
}

ocultar(){

window.document.querySelector('ion-app').classList.remove('transparentBody')

}

 

leer(){

	this.iniciar()

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
