using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using corona.Entities;
using corona.Models;
using corona.Services;
using corona.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

using Microsoft.Extensions.DependencyInjection;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace corona.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoronaController : ControllerBase
    {

        private readonly ICoronaService _coronaService;

        public CoronaController(IServiceProvider services)
        {
            _coronaService = services.GetService<ICoronaService>();


        }

        [HttpGet("country")]
        public async Task<IActionResult> FetchAllHistoricalData([FromQuery] int timelineLimit = 30)
        {

            List<CoronaRecord> res = await _coronaService.GetAll(timelineLimit);
            return Ok(res);
        }

        [HttpGet("country/{code}")]
        public async Task<IActionResult> FetchCoronaHistoricalData(string code, [FromQuery] int timelineLimit = 30)
        {
            try
            {
                CoronaRecord res = await _coronaService.GetOne(code, timelineLimit);
                return Ok(res);
            }
            catch (Exception e)
            {
                throw e;
                //return Problem("problem!", e.Message);
            }

        }

        [HttpGet("all")]
        public async Task<IActionResult> FetchWorldData([FromQuery] int timelineLimit = 30)
        {
            return Ok(await _coronaService.GetWorldRecord(timelineLimit));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCoronaRecord(CoronaRecord record)
        {
            await _coronaService.InsertRecord(record);
            return Ok(new
            {
                message = "Record added successfully",
                record,
            });
        }

        [HttpPost("records")]
        [Authorize]
        public async Task<IActionResult> CreateCoronaRecords(IEnumerable<CoronaRecord> records)
        {
            await _coronaService.InsertRecords(records);
            return Ok(new
            {
                message = "Record added successfully",
                records,
            });
        }


        // POST api/<CoronaController>
        [HttpPatch("timeline/{code}")]
        [Authorize]
        public async Task<IActionResult> UpdateTimeLine([FromBody] TimelineRecord record, string code, [FromQuery] int timelineLimit = 30)
        {
            await _coronaService.UpdateTimeLineRecord(code, record);
            return Ok(new
            {
                message = "Timeline updated",
                updatedDocument = await _coronaService.GetOne(code, timelineLimit),
                worldRecord = await _coronaService.GetWorldRecord(timelineLimit)

            });
        }
    }
}
