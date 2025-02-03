using HRapplication.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Xml.Linq;

namespace HRapplication.Controllers
{
    [RoutePrefix("api/Employee")]
    public class EmployeeController : ApiController
    {
        eEmloyeeEntities context = new eEmloyeeEntities();
        //POST: /api/Employee/Add
        [Route("Add")]
        public dynamic Add(ListEmployess entity)
        {
            context.ListEmployesses.Add(entity);
            context.SaveChanges();
            return 0;
        }

        // GET: /api/Employee/GetByID/{ID}
        [Route("GetByID/{ID:long}")]
        [HttpGet]
        public IHttpActionResult GetByID(long ID)
        {
            try
            {
                // Fetch employee by ID
                var employee = context.ListEmployesses.FirstOrDefault(e => e.employeeID == ID);

                if (employee == null)
                {
                    return NotFound(); // Return 404 if the employee is not found
                }

                return Ok(employee); // Return the found employee
            }
            catch (Exception ex)
            {
                // Handle any errors that occur during the fetch
                return InternalServerError(ex);
            }
        }


        // Post: /api/Employee/Update/{ID}
        [HttpPost]
        [Route("Update/{ID}")]
        public IHttpActionResult Update(long ID, ListEmployess entity)
        {
            try
            {
                // Find the employee from the database
                var existingEmployee = context.ListEmployesses.FirstOrDefault(e => e.employeeID == ID);

                if (existingEmployee == null)
                {
                    return NotFound(); // Return 404 if the employee is not found
                }

                // Update the properties of the existing employee
                existingEmployee.firstName = entity.firstName;
                existingEmployee.lastName = entity.lastName;
                existingEmployee.Division = entity.Division;
                existingEmployee.Building = entity.Building;
                existingEmployee.Title = entity.Title;
                existingEmployee.Room = entity.Room;

                // Mark the entity as modified
                context.Entry(existingEmployee).State = EntityState.Modified;

                // Save the changes to the database
                context.SaveChanges();

                return Ok(existingEmployee); // Return the updated employee
            }
            catch (Exception ex)
            {
                // Handle any exceptions
                return InternalServerError(ex);
            }
        }

        [Route("Delete/{ID:int}")]
        [HttpDelete]  // Ensure the HTTP method is DELETE
        public Int32 Delete(int ID)
        {
            return context.ListEmployesses.Delete(ID);
        }


        [HttpPost]
        [Route("api/employees/upload")]
        public IHttpActionResult UploadEmployees()
        {
            try
            {
                // Path to the XML file (you can also accept the file as a parameter in the request)
                string xmlFilePath = "file:///C:/Users/NTI/Downloads/employee.xml";

                // Parse the XML file
                List<ListEmployess> ListEmployess = ParseXmlFile(xmlFilePath);

                // Insert the data into the SQL database using DbContext
                InsertEmployeesIntoDatabase(ListEmployess);

                return Ok("Data inserted successfully.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        private List<ListEmployess> ParseXmlFile(string xmlFilePath)
        {
            XDocument xmlDoc = XDocument.Load(xmlFilePath);

            var employees = xmlDoc.Descendants("employee")
                                  .Select(emp => new ListEmployess
                                  {
                                      employeeID = (int)emp.Attribute("id"),
                                      firstName = (string)emp.Element("firstname"),
                                      lastName = (string)emp.Element("lastname"),
                                      Title = (string)emp.Element("title"),
                                      Division = (string)emp.Element("division"),
                                      Building = (string)emp.Element("building"),
                                      Room = (string)emp.Element("room")
                                  }).ToList();

            return employees;
        }

        private void InsertEmployeesIntoDatabase(List<ListEmployess> ListEmployess)
        {
            using (var context = new eEmloyeeEntities())
            {
                context.ListEmployesses.AddRange(ListEmployess);
                context.SaveChanges();
            }
        }


    }
}
