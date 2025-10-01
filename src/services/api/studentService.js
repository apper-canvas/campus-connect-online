import studentsData from "@/services/mockData/students.json";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const studentService = {
  getAll: async () => {
    await delay();
    return [...studentsData];
  },

  getById: async (id) => {
    await delay();
    const student = studentsData.find(s => s.Id === parseInt(id));
    if (!student) throw new Error("Student not found");
    return { ...student };
  },

create: async (student) => {
    await delay();
    const maxId = Math.max(...studentsData.map(s => s.Id), 0);
    
    // Handle PDF file conversion to base64 if provided
    let aadharCardPdfData = null;
if (student.aadharCardPdf && typeof student.aadharCardPdf === 'object' && student.aadharCardPdf.constructor.name === 'File') {
      const reader = new FileReader();
      aadharCardPdfData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(student.aadharCardPdf);
      });

      // Process PDF to remove blank pages
      if (aadharCardPdfData) {
        try {
          const blankPageRemovalResult = await apperClient.functions.invoke(
            import.meta.env.VITE_REMOVE_BLANK_PAGES,
            {
              body: JSON.stringify({ pdfData: aadharCardPdfData }),
              headers: { 'Content-Type': 'application/json' }
            }
          );

          if (blankPageRemovalResult && blankPageRemovalResult.ok) {
            const processedData = await blankPageRemovalResult.json();
            if (processedData.success) {
              aadharCardPdfData = processedData.pdfData;
              toast.success(
                `PDF processed: ${processedData.pagesRemoved} blank page(s) removed (${processedData.originalPageCount} → ${processedData.finalPageCount} pages)`,
                { position: "top-right", autoClose: 5000 }
              );
            }
          } else {
            const responseData = await blankPageRemovalResult.json().catch(() => ({}));
            console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_REMOVE_BLANK_PAGES}. The response body is: ${JSON.stringify(responseData)}.`);
            toast.warning("PDF uploaded but blank page removal failed", {
              position: "top-right",
              autoClose: 5000
            });
          }
        } catch (error) {
          console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_REMOVE_BLANK_PAGES}. The error is: ${error.message}`);
          toast.warning("PDF uploaded but processing unavailable", {
            position: "top-right",
            autoClose: 5000
          });
        }
      }
    }
    
    const newStudent = {
      ...student,
      Id: maxId + 1,
      studentId: `ST${new Date().getFullYear()}${String(maxId + 1).padStart(3, "0")}`,
      aadharCardPdf: aadharCardPdfData,
      aadharCardFileName: student.aadharCardPdf?.name || null
    };
    
    // Remove File object from stored data
    delete newStudent.aadharCardPdf;
    if (aadharCardPdfData) {
      newStudent.aadharCardPdf = aadharCardPdfData;
    }
    
    studentsData.push(newStudent);
    
    // Call webhook Edge Function with complete student data
    const webhookStartTime = Date.now();
    try {
      const requestPayload = {
        body: JSON.stringify(newStudent),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      console.info(`apper_info: Invoking webhook function: ${import.meta.env.VITE_WEBHOOK} with payload:`, {
        studentId: newStudent.studentId,
        payloadSize: requestPayload.body.length,
        timestamp: new Date().toISOString()
      });
      
      const result = await apperClient.functions.invoke(import.meta.env.VITE_WEBHOOK, requestPayload);
      const duration = Date.now() - webhookStartTime;
      
      if (result && !result.ok) {
        const responseData = await result.json().catch(() => ({}));
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_WEBHOOK}. Status: ${result.status}, Duration: ${duration}ms, Response body: ${JSON.stringify(responseData)}.`);
        toast.warning("Student created but webhook notification failed", {
          position: "top-right",
          autoClose: 5000
        });
      } else {
        console.info(`apper_info: Webhook function ${import.meta.env.VITE_WEBHOOK} invoked successfully in ${duration}ms`);
      }
    } catch (error) {
      const duration = Date.now() - webhookStartTime;
      const errorDetails = {
        function: import.meta.env.VITE_WEBHOOK,
        error: error.message,
        errorType: error.name,
        duration: `${duration}ms`,
        studentId: newStudent.studentId,
        timestamp: new Date().toISOString(),
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      };
      
      console.info(`apper_info: Network error invoking function: ${import.meta.env.VITE_WEBHOOK}. Details:`, errorDetails);
      
      toast.error("Student created but notification system is unavailable", {
        position: "top-right",
        autoClose: 5000
      });
    }
    
    return { ...newStudent };
  },

  update: async (id, data) => {
    await delay();
    const index = studentsData.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Student not found");
    studentsData[index] = { ...studentsData[index], ...data };
    return { ...studentsData[index] };
  },

  delete: async (id) => {
    await delay();
    const index = studentsData.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Student not found");
    studentsData.splice(index, 1);
    return true;
  }
};

export default studentService;