import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styles: [],
})
export class FlightsComponent implements OnInit {
  FlightForm!: FormGroup;
  loading: boolean = false;
  loadingData: boolean = false;
  flights: any[] = [];
  actualData: any[] = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private nzNotify: NzMessageService
  ) {}

  ngOnInit(): void {
    this.FlightForm = this.fb.group({
      code: [null],
      file: [null, [Validators.required]],
    });
    this.LoadData();
  }
  LoadData() {
    this.loadingData = true;
    this.http.get(`${environment.baseUrl}Flights`).subscribe((res: any) => {
      console.log(res);
      if (res.data) {
        this.flights = res.data;
        this.actualData = res.data;
      } else {
        this.nzNotify.error(res.message);
      }
      this.loadingData = false;
    });
  }
  SubmitFile() {
    this.loading = true;
    const formData = new FormData();
    formData.append('flightFile', this.FlightForm.get('file')?.value);
    this.http
      .post(`${environment.baseUrl}UploadFlight`, formData)
      .subscribe((res: any) => {
        if (res.data) {
          this.nzNotify.success(res.message);
          this.LoadData();
        } else {
          this.nzNotify.error(res.message);
        }
        this.loading = false;
      });
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.FlightForm.patchValue({
        file: file,
      });
    }
  }
  FilterData() {
    if (this.FlightForm.get('code')?.value == '') {
      this.flights = this.actualData;
    } else {
      this.flights = this.actualData.filter(
        (x) =>
          x.passengerSeat.toLowerCase() ==
          this.FlightForm.get('code')?.value.toLowerCase()
      );
    }
  }
}
