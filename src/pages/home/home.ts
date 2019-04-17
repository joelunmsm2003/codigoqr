import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Storage } from '@ionic/storage';
import { Http,RequestOptions, Headers } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


	scanSub:any;
  user:any={}
  muestraregistro:any=true
  codigoqr:any
  estado:any
  accion:any=1
  estadorespuesta:any;
  nombre:any;
  fecha:any;
  acciones:any;
  obras:any=[]
  muestraqr:any=true;
  latitud:any;
  longitud:any;
  array:any;
  camaralado:any;

  constructor(private geolocation: Geolocation,public toastCtrl: ToastController,public http: Http,public storage: Storage,private qrScanner: QRScanner,public navCtrl: NavController) {}

 

  ionViewDidLoad() {

this.camaralado=true
      this.geolocation.getCurrentPosition().then((resp) => {
 // resp.coords.latitude
 // resp.coords.longitude

 this.latitud=resp.coords.latitude
 this.longitud=resp.coords.longitude

 this.agregatoast(resp.coords.latitude+'-'+resp.coords.longitude)

}).catch((error) => {
  this.agregatoast(error)
});



       this.http.get('http://142.93.198.91/apirest/public/api/listobra')
     .subscribe(
      data => {

          //console.log('API de ANDER',JSON.parse(data['_body']))

          this.obras=JSON.parse(data['_body'])

      }),

      error => {

      }


      this.acciones=[{'id':1,'nombre':'Ingreso'},{'id':2,'nombre':'Salida'}]


  }


   agregatoast(data) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 2000,
      cssClass: 'mitoast',
      position:'bottom',
    });
    toast.present();
  }


  ingresar(user){



    console.log('obra',user.obra)

    if(user.obra){

                this.http.get('http://142.93.198.91/apirest/public/index.php/api/login/'+user.usuario+'/'+user.password)
           .subscribe(
            data => {


                console.log('Usuario..',JSON.parse(data['_body']))


               this.estado= JSON.parse(data['_body'])[0]['Nombre']

               if(this.estado!='Usuario no registrado'){


                    console.log()

                    this.muestraregistro=false



                    this.agregatoast('Bienvenido')

                    this.leer()


                }
                else{

                    this.agregatoast(this.estado)

                }

            

            }),

            error => {

              this.agregatoast('Error :'+ error)

            }

         
          this.storage.set('user',user)

          




    }
    else{

        this.agregatoast('Agregar Obra')

    }






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


this.muestraqr=true

this.nombre=false

window.document.querySelector('ion-app').classList.remove('transparentBody')

}

salir(){

  this.user={}
  this.muestraregistro=true

  this.ocultar()
}


back(){

  this.qrScanner.useBackCamera()

  this.camaralado=true

  this.qrScanner.useCamera(0)
  this.leer()
   
}

frontal(){

  this.qrScanner.useFrontCamera()
  this.qrScanner.useCamera(1)

  this.camaralado=false

  this.leer()
   
}

 

leer(){


////



  console.log(this.user.accion)

  this.user.accion=1

  if(this.user.accion){

  this.muestraqr=false

	this.iniciar()

  this.agregatoast('Acerque al codigo QR')

	window.document.querySelector('ion-app').classList.add('transparentBody')

  console.log('obra...',this.user.accion)

  this.accion=this.user.accion

	//this.qrScanner.show();

	this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
     if (status.authorized) {

       // camera permission was granted
       
       // start scanning
       
       this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
         
       this.agregatoast('Scan: '+text)

       this.codigoqr=text

        let options: RequestOptions = new RequestOptions({
        headers: new Headers({ 'Content-Type': 'application/json' })
        });

        let data = JSON.stringify({ qr:this.codigoqr,obra:this.user.obra,accion:1,latitud:this.latitud,longitud:this.longitud});

        this.http.post('http://142.93.198.91/apirest/public/index.php/api/registro', data, options)
        .subscribe(
        data => {

            this.estadorespuesta= JSON.parse(data['_body'])[0]['estado']

            if (this.estadorespuesta=='1'){

                  this.nombre= JSON.parse(data['_body'])[0]['persona']

                  this.fecha= JSON.parse(data['_body'])[0]['fecha']

                  this.agregatoast(this.nombre+'-'+this.fecha)
            }

            else{

                this.nombre=''

                this.fecha=''

                this.agregatoast('Codigo QR no existe')

             }

             this.leer()
         

        })

          error => {

            this.agregatoast('Error :'+ error)

          }


          ////


         //this.ocultar()

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

	 .catch((e: any) => this.agregatoast('Error: '+ e));



  // Optionally request the permission early
}

else{


  this.agregatoast('Ingrese una accion')


  }

} 




}
