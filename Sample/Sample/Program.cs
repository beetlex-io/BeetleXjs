using BeetleX.EventArgs;
using BeetleX.FastHttpApi.Hosting;
using Microsoft.Extensions.Hosting;
using System;
using Northwind.Data;
using System.Linq;
namespace Sample
{
    [BeetleX.FastHttpApi.Controller]
    class Program
    {
        static void Main(string[] args)
        {
            var builder = new HostBuilder()
              .ConfigureServices((hostContext, services) =>
              {
                  services.UseBeetlexHttp(o =>
                  {
                      o.Port = 80;
                      o.LogToConsole = true;
                      o.SetDebug();
                      o.LogLevel = LogType.Warring;
                  },
                  typeof(Program).Assembly);
              });
            builder.Build().Run();
        }

        public object Login(string name, string pwd)
        {
            if (name == "admin" && pwd == "123456")
                return true;
            return false;
        }

        public object CustomersSelect()
        {
            return from a in DataHelper.Defalut.Customers
                   select new
                   {
                       a.CustomerID,
                       Name = $"{a.CompanyName}"
                   };
        }

        public object ListOrders(int employeeid, string customerid)
        {
            return from a in DataHelper.Defalut.Orders
                   where (employeeid == 0 || a.EmployeeID == employeeid) && (string.IsNullOrEmpty(customerid) || a.CustomerID == customerid)
                   select a;
        }

        public object EmployeesSelect()
        {
            return from a in DataHelper.Defalut.Employees select new { a.EmployeeID, Name = $"{a.FirstName} {a.LastName}" };
        }

        public object ListEmployees()
        {
            return DataHelper.Defalut.Employees;
        }

        public object AddEmployee(Employee body)
        {
            return body;
        }
    }
}
