const issueModel = require('../model/issue.model');
const issueValidator = require('../validator/issue.validator');
const issueDal = require('../dal/issue.dal');

async function httpGetAllIssues(req, res) {

    const { skip, limit } = req.query;

    const issueObj = {
        skip: skip,
        limit: limit
    }

    const results = await issueModel.modelGetAllIssues(issueObj);

    const dto = issueDal.toDto(results);

    return res.status(200).json(dto);
};

async function httpCreateNewIssue(req, res) {

    const body = req.body;

    try{

        issueValidator.validateInputString(body);

    }
    catch(err){

        console.log(`Error: ${err.message}`);

        return res.status(400).json({'error': err.message});

    }

    const { title, description, userId } = body;

    try{

        await issueModel.modelCreateIssue(title, description, userId);

        return res.status(201);

    }
    catch(err){

        console.log(`Error: ${err.message}`);

        return res.status(400).json({'error': err.message});

    }

};

async function httpGetOneIssue(req, res, next){

    const issueId = req.params.id;
    
    try {
        
        const results = await issueModel.modelGetOneIssue(issueId);

        const dto = issueDal.toDto(results);

        return res.status(200).json(dto);

    } catch (error) {
        
        console.log(`Error: ${err.message}`);

        return res.status(404).json({'error': err.message});

    }

    
};

async function httpUpdateIssue(req, res){

    const issueId = req.params.id;

    const body = req.body;

    try{

        issueValidator.validateInputString(body);

    }
    catch(err){

        console.log(`Error: ${err.message}`);

        return res.status(400).json({'error': err.message});

    }

    const issueData = {
        id: issueId,
        title: body.title,
        description: body.description,
        status: body.status
    };

    try {
        
        await issueModel.modelUpdateIssue(issueData);

        return res.status(204)

    } catch (error) {
        
        console.log(`Error: ${err.message}`);

        return res.status(404).json({'error': err.message});

    }
}

async function httpArchiveIssue(req, res){

    const issueId = req.params.id;

    try {
        
        await issueModel.modelArchiveIssue(issueId);

        return res.status(204)

    } catch (error) {
        
        console.log(`Error: ${err.message}`);

        return res.status(404).json({'error': err.message});

    }
}

async function httpSearchIssues(req, res){

    const {} = req.query;
}


module.exports = {
    httpGetAllIssues,
    httpCreateNewIssue,
    httpGetOneIssue,
    httpUpdateIssue,
    httpArchiveIssue,
    httpSearchIssues
}