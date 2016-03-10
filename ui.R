#thanks to https://www.trestletechnology.net/2012/12/reconstruct-gene-networks/


reactiveMix <- function (outputId) 
{
  HTML(paste("<div id=\"", outputId, "\" class=\"shiny-network-output\"><svg /></div>", sep=""))
}

functionList <- c("1st proportion"="prop1","2nd proportion"="prob2")
  ## what can we save?

shinyUI(pageWithSidebar(    
  headerPanel(HTML("Mix It Up")),
  
  sidebarPanel(
    numericInput("nCat", "Number of categories:", 3, min = 2, max = 10),
    textInput("categories","Category names: ", "A, B, C"),
    textInput("counts", "Numbers of each:", "2, 3, 2"),
    helpText("Separate with commas. "),
    numericInput("nDraws", "Number of draws:", 3 ),
    helpText("no more than sum of ball numbers unless replace = yes. "),
    selectInput("replace","Replace each draw?",c("yes","no"),1),  
    submitButton("Update the Sample")  ##,
 ##   selectInput("fn","What to save?", functionList, 1),
 ##   checkboxGroupInput("reps", "More Samples:", c("1","10","100","1000"))
   ),  
  
  mainPanel(
    includeHTML("newMix.js"),
    reactiveMix(outputId = "mixPlot"),
    ##reactivePrint(output$data.df$balls),
    verbatimTextOutput("summary")

  )

))
