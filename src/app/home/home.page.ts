import { Component } from '@angular/core';
import { BdService } from './../../Services/bd.service';
import { ToastService } from 'src/Services/toast.service';
import { LoadingService } from 'src/Services/loading.service';

interface Plato {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

@Component({
  selector: 'app-restaurante',
  templateUrl: 'restaurante.page.html',
  styleUrls: ['restaurante.page.scss'],
})
export class RestaurantePage {
  private enlace: string = 'Platos';
  public platos: Plato[] = [];
  public nuevaReservacion: Plato = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
  };

  constructor(private bd: BdService, private toast: ToastService, private load: LoadingService) {}

  ngOnInit() {
    this.bd.get<Plato>(this.enlace).subscribe((platos: Plato[]) => {
      this.platos = platos;
    });
  }

  realizarReservacion() {
    this.load.presentLoading();
    const id = this.bd.createId(this.enlace);
    const data = { ...this.nuevaReservacion, id };
    this.bd
      .add<Plato>(data, this.enlace, id)
      .then(() => {
        this.toast.showToast('Reservación exitosa', 'success', 'checkbox-outline');
        this.load.dismissLoading();
        this.limpiarDatosReservacion();
      })
      .catch(() => {
        this.toast.showToast('Error al realizar la reservación', 'danger', 'sad-outline');
      });
  }

  limpiarDatosReservacion() {
    this.nuevaReservacion.nombre = '';
    this.nuevaReservacion.descripcion = '';
    this.nuevaReservacion.precio = 0;
    this.nuevaReservacion.imagen = '';
  }
}
