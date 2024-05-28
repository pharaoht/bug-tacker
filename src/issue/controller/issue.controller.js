const issueModel = require('../model/issue.model');
const issueValidator = require('../validator/issue.validator');
const issueDal = require('../dal/issue.dal');
const { camelToSnake } = require('../../util/index');
const { htmlToPdfBuilder } = require('../../services/pdf/pdf.services');

async function httpGetAllIssues(req, res) {

    const { skip, limit } = req.query;

    const issueObj = {
        skip: skip,
        limit: limit
    }

    try{
        const results = await issueModel.modelGetAllIssues(issueObj);

        const dto = issueDal.toDto(results);
  
        return res.status(200).json(dto);
    }
    catch(error){
        console.log(error)
        return res.status(400).json({error:'something went wrong'})
    }


};

async function httpCreateNewIssue(req, res) {

    const body = req.body;

    try{

        issueValidator.validateInputString(body);

        const { title, description, userId, status, priority, teamId } = body;

        await issueModel.modelCreateIssue(title, description, userId, status, priority, teamId);

        return res.status(200).json({ data:'success' })

    }
    catch(error){

        console.log(`Error: ${error.message}`);

        return res.status(400).json({'error': error.message});

    }

};

async function httpGetOneIssue(req, res, next){

    const issueId = req.params.id;
    
    try {
        
        const results = await issueModel.modelGetOneIssue(issueId);

        const dto = issueDal.toDto(results);

        return res.status(200).json(dto);

    } catch (error) {
        
        console.log(`Error: ${error.message}`);

        return res.status(404).json({'error': error.message});

    }

    
};

async function httpUpdateIssue(req, res){

    const issueId = req.params.id;

    const body = req.body;

    try{

        issueValidator.validateInputString(body);

    }
    catch(error){

        console.log(`Error: ${error.message}`);

        return res.status(400).json({'error': error.message});

    }

    const issueData = {
        id: issueId,
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority
    };

    const fromDto = issueDal.fromDto(issueData);

    try {
        
        await issueModel.modelUpdateIssue(fromDto);

        return res.status(200).json({ data: 'success' })

    } catch (error) {
        
        console.log(`Error: ${error.message}`);

        return res.status(404).json({'error': error.message});

    }
}

async function httpArchiveIssue(req, res){

    const issueId = req.params.id;

    try {
        
        await issueModel.modelArchiveIssue(issueId);

        return res.status(200).json({ data: 'success' })

    } catch (error) {
        
        console.log(`Error: ${error.message}`);

        return res.status(404).json({'error': error.message});

    }
}

async function httpSearchIssues(req, res){

    if(Object.keys(req.query).length === 0){
        return res.status(400).json({ error:'Please provide a search term'})
    }

    try{

        const { searchTerm } = req.query;
       
        const results = await issueModel.modelSearchIssues(searchTerm);

        const dto = issueDal.toDto(results);

        return res.status(200).json(dto);
        
    }
    catch(error){
        console.log(error)
        return res.status(400).json({ error:'Something went wrong'})
    }

}

async function httpGetIssuesByStatus(req, res){

    const statusType = req.params.type;

    if(!statusType){
        return res.status(400).json({ error: 'Please provide a priority type identifier in your request' });
    }

    const obj = { status: statusType };

    const fromDto = issueDal.fromDto(obj);

    try{

        const { status } = fromDto

        const results = await issueModel.modelGetIssuesByStatus(status);

        const dto = issueDal.toDto(results);

        return res.status(200).json(dto);
    }
    catch(error){
        console.log('error', error.message)
        return res.status(400).json({ error: error.message })
    }

}

async function httpGetIssuesByPriority(req, res){

    const priorityType = req.params.type;

    if(!priorityType){
        return res.status(400).json({ error: 'Please provide a priority type identifier in your request' });
    };

    const obj = { priority: priorityType }

    const fromDto = issueDal.fromDto(obj);

    try {

        const { priority } = fromDto;

        const results = await issueModel.modelGetIssueByPriority(priority);
        
        const dto = issueDal.toDto(results);

        return res.status(200).json(dto);
    }
    catch(error){

        console.log('error', error.message)
        return res.status(400).json({ error: error.message })
    }

};

async function httpExportToPdf(req, res){

    try{

        const pdfBuffer = await htmlToPdfBuilder();

        res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', pdfBuffer.length);

        res.send(pdfBuffer);
    }
    catch(error){
        console.log('error', error.message)
        return res.status(400).json({ error: error.message })
    }
}

async function httpSortIssues(req, res){

    try{

    }
    catch(error){

    }
};

async function httpGetIssuesByUserId(req, res){

    const userId = req.params.id;

    try{

    }
    catch(error){

    }
}


module.exports = {
    httpGetAllIssues,
    httpCreateNewIssue,
    httpGetOneIssue,
    httpUpdateIssue,
    httpArchiveIssue,
    httpSearchIssues,
    httpSortIssues,
    httpGetIssuesByUserId,
    httpGetIssuesByPriority,
    httpGetIssuesByStatus,
    httpExportToPdf
}