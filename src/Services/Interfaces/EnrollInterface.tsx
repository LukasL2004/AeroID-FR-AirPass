export interface enroll {
  photo: Blob;
  name: string;
  flight: string;
}

export interface EnrollResponse {
  success: boolean;
  token: string;
  qrCode: string;
  passengerName: string;
  flight: string;
}

export interface enrollVerify{
  name: string;
  flight: string;
}