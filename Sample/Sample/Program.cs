using BeetleX.EventArgs;
using BeetleX.FastHttpApi.Hosting;
using Microsoft.Extensions.Hosting;
using System;
using Northwind.Data;
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
