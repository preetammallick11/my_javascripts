import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  constructor(private http: HttpClient) { }
  
  get_data() {
    return this.http.get("http://localhost:3000/my-data")
  }

  post_data(formData) {
    return this.http.post("http://localhost:3000/post-data", formData)
  }

  update_my_data_from_mongo(editUserDetails) {
    return this.http.put("http://localhost:3000/update-data", editUserDetails)
  }

  delete_user_data(user) {
    //console.log(user)
    return this.http.post("http://localhost:3000/delete-data", user)
  }
}
