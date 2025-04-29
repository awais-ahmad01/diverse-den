import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const getWeeklySales = createAsyncThunk(
    'analytics/getWeeklySales',
    async ({business, startDate, endDate}, thunkAPI) => {

      try {
        console.log("Get Weekly sales.....");

        console.log("Start date", startDate)
        console.log("end date", endDate)


        console.log('business:',business)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          throw new Error('No token found');
          return;
        }
  
        const response = await axios.get('http://localhost:3000/branchOwner/weeklySalesReports', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            businessId:business,
           startDate,
           endDate
          },
        })
  
        console.log("weekly sales...:", response.data);

        
        return { data: response.data};
      } catch (error) {
        
        throw error;
      }
    }
  );



  export const getMonthlySales = createAsyncThunk(
    'analytics/getMonthlySales',
    async ({business, month, year}, thunkAPI) => {

      try {
        console.log("Get monthly sales.....");

        console.log("month", month)
        console.log("year", year)


        console.log('business:',business)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          throw new Error('No token found');
          return;
        }
  
        const response = await axios.get('http://localhost:3000/branchOwner/monthlySalesReports', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            businessId:business,
            month,
            year
          },
        })
  
        console.log("monthly sales...:", response.data);

        
        return { data: response.data};
      } catch (error) {
        
        throw error;
      }
    }
  );


  
  
    export const getYearlySales = createAsyncThunk(
      'analytics/getYearlySales',
      async ({business, year}, thunkAPI) => {
  
        try {
          console.log("Get yearly sales.....");
  
        
          console.log("year", year)
  
  
          console.log('business:',business)
    
          const token = localStorage.getItem("token");
          console.log("myToken:", token);
    
          if (!token) {
            throw new Error('No token found');
            return;
          }
    
          const response = await axios.get('http://localhost:3000/branchOwner/yearlySalesReports', {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              businessId:business,
              year
            },
          })
    
          console.log("yearly sales...:", response.data);
  
          
          return { data: response.data};
        } catch (error) {
          
          throw error;
        }
      }
    );

   

    export const getWeeklyRevenue = createAsyncThunk(
      'analytics/getWeeklyRevenue',
      async ({business, startDate, endDate}, thunkAPI) => {
  
        try {
          console.log("Get Weekly Revenue.....");
  
          console.log("Start date", startDate)
          console.log("end date", endDate)
  
  
          console.log('business:',business)
    
          const token = localStorage.getItem("token");
          console.log("myToken:", token);
    
          if (!token) {
            throw new Error('No token found');
            return;
          }
    
          const response = await axios.get('http://localhost:3000/branchOwner/weeklyRevenueReports', {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              businessId:business,
             startDate,
             endDate
            },
          })
    
          console.log("weekly Revenue...:", response.data);
  
          
          return { data: response.data};
        } catch (error) {
          
          throw error;
        }
      }
    );
  
  
  
    export const getMonthlyRevenue = createAsyncThunk(
      'analytics/getMonthlyRevenue',
      async ({business, month, year}, thunkAPI) => {
  
        try {
          console.log("Get monthly Revenue.....");
  
          console.log("month", month)
          console.log("year", year)
  
  
          console.log('business:',business)
    
          const token = localStorage.getItem("token");
          console.log("myToken:", token);
    
          if (!token) {
            throw new Error('No token found');
            return;
          }
    
          const response = await axios.get('http://localhost:3000/branchOwner/monthlyRevenueReports', {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              businessId:business,
              month,
              year
            },
          })
    
          console.log("monthly Revenue...:", response.data);
  
          
          return { data: response.data};
        } catch (error) {
          
          throw error;
        }
      }
    );
  
  
    
    
      export const getYearlyRevenue = createAsyncThunk(
        'analytics/getYearlyRevenue',
        async ({business, year}, thunkAPI) => {
    
          try {
            console.log("Get yearly Revenue.....");
    
          
            console.log("year", year)
    
    
            console.log('business:',business)
      
            const token = localStorage.getItem("token");
            console.log("myToken:", token);
      
            if (!token) {
              throw new Error('No token found');
              return;
            }
      
            const response = await axios.get('http://localhost:3000/branchOwner/yearlyRevenueReports', {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              params: {
                businessId:business,
                year
              },
            })
      
            console.log("yearly Revenue..:", response.data);
    
            
            return { data: response.data};
          } catch (error) {
            
            throw error;
          }
        }
      );





      export const getDailyTrendingProducts = createAsyncThunk(
        'analytics/getDailyTrendingProducts',
        async ({business, date}, thunkAPI) => {
    
          try {
            console.log("Get Daily Trending Products.....");
    
            console.log("date", date)
            
    
    
            console.log('business:',business)
      
            const token = localStorage.getItem("token");
            console.log("myToken:", token);
      
            if (!token) {
              throw new Error('No token found');
              return;
            }
      
            const response = await axios.get('http://localhost:3000/branchOwner/dailyTrendingProducts', {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              params: {
                businessId:business,
                date
              },
            })
      
            console.log("Daily Trending Products...:", response.data);
    
            
            return { data: response.data};
          } catch (error) {
            
            throw error;
          }
        }
      );
    


      export const getWeeklyTrendingProducts = createAsyncThunk(
        'analytics/getWeeklyTrendingProducts',
        async ({business, startDate, endDate}, thunkAPI) => {
    
          try {
            console.log("Get Weekly Trending Products.....");
    
            console.log("Start date", startDate)
            console.log("end date", endDate)
    
    
            console.log('business:',business)
      
            const token = localStorage.getItem("token");
            console.log("myToken:", token);
      
            if (!token) {
              throw new Error('No token found');
              return;
            }
      
            const response = await axios.get('http://localhost:3000/branchOwner/weeklyTrendingProducts', {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              params: {
                businessId:business,
               startDate,
               endDate
              },
            })
      
            console.log("weekly Trending Products...:", response.data);
    
            
            return { data: response.data};
          } catch (error) {
            
            throw error;
          }
        }
      );
    
    
    
      export const getMonthlyTrendingProducts = createAsyncThunk(
        'analytics/getMonthlyTrendingProducts',
        async ({business, month, year}, thunkAPI) => {
    
          try {
            console.log("Get monthly Trending Products.....");
    
            console.log("month", month)
            console.log("year", year)
    
    
            console.log('business:',business)
      
            const token = localStorage.getItem("token");
            console.log("myToken:", token);
      
            if (!token) {
              throw new Error('No token found');
              return;
            }
      
            const response = await axios.get('http://localhost:3000/branchOwner/monthlyTrendingProducts', {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              params: {
                businessId:business,
                month,
                year
              },
            })
      
            console.log("monthly Trending Products...:", response.data);
    
            
            return { data: response.data};
          } catch (error) {
            
            throw error;
          }
        }
      );
    




      export const getWeeklySubscriptionReports = createAsyncThunk(
        'analytics/getWeeklySubscriptionReports',
        async ({startDate, endDate}, thunkAPI) => {
    
          try {
            console.log("Get WeeklySubscription Reports.....");
    
            console.log("Start date", startDate)
            console.log("end date", endDate)
    
    
      
            const token = localStorage.getItem("token");
            console.log("myToken:", token);
      
            if (!token) {
              throw new Error('No token found');
              return;
            }
      
            const response = await axios.get('http://localhost:3000/admin/weeklySubscriptionReports', {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              params: {
               startDate,
               endDate
              },
            })
      
            console.log("weekly Subscription Reports...:", response.data);
    
            
            return { data: response.data};
          } catch (error) {

            console.log(error.response.data.message)  
            
            throw error;
          }
        }
      );
    
    
    
      export const getMonthlySubscriptionReports = createAsyncThunk(
        'analytics/getMonthlySubscriptionReports',
        async ({month, year}, thunkAPI) => {
    
          try {
            console.log("Get monthly subscription Reports.....");
    
            console.log("month", month)
            console.log("year", year)
    
  
      
            const token = localStorage.getItem("token");
            console.log("myToken:", token);
      
            if (!token) {
              throw new Error('No token found');
              return;
            }
      
            const response = await axios.get('http://localhost:3000/admin/monthlySubscriptionReports', {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              params: {
                month,
                year
              },
            })
      
            console.log("monthly subscription Reports...:", response.data);
    
            
            return { data: response.data};
          } catch (error) {
            
            throw error;
          }
        }
      );



      
      export const getYearlySubscriptionReports = createAsyncThunk(
        'analytics/getYearlySubscriptionReports',
        async ({month, year}, thunkAPI) => {
    
          try {
            console.log("Get yearly Subscription Reports.....");
    
          
            console.log("year", year)
    
  
      
            const token = localStorage.getItem("token");
            console.log("myToken:", token);
      
            if (!token) {
              throw new Error('No token found');
              return;
            }
      
            const response = await axios.get('http://localhost:3000/admin/yearlySubscriptionReports', {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              params: {
                month,
                year
              },
            })
      
            console.log("yearly subscription Reports...:", response.data);
    
            
            return { data: response.data};
          } catch (error) {
            
            throw error;
          }
        }
      );

    
    
    
     