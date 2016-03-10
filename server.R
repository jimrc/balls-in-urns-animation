#thanks to https://www.trestletechnology.net/2012/12/reconstruct-gene-networks/

shinyServer(function(input, output) {
  ## sample locations for the balls from a grid of points.
  ## spacing and ball radius depend on window size and numbers of points.
  ## we want to use about half the possible points,
  ## and limit max radius to 16 pixels.
  ## assume height is the limiting dimension
  h <-  330
  
  data <- reactive( {
      counts <- sapply(strsplit(input$counts, ","), as.integer)
      nBalls <-  sum(counts)
      nDraws <- input$nDraws
      ## make radius small enough so that only about half of the
      ##  (h/r)^2 points are utilized
      radius <-  pmin(16, round( h/2 / sqrt(2 * nBalls)))
      gridpoints <- expand.grid( x = seq( 0, h, 2*radius),
                                 y = seq( 0, h, 2*radius))
      gridpoints <- subset( gridpoints, sqrt((x-h/2)^2 + (y-h/2)^2) < h/2 - radius)
      groups <- sapply(strsplit(input$categories, ","), function(x)
                       gsub("[[:space:]]", "", x))
      if(input$replace == "no"){
        balls <- sample( rep(groups, counts), pmax(nBalls,nDraws))
      } else {
        balls <- sample( rep(groups, counts) )
        if(nBalls < nDraws)
          balls <- rep(balls, ceiling(nDraws / nBalls))[1:nDraws]
      }
      drawColor <- as.numeric(factor(balls, levels=groups)) -1
      sampleLocs <- gridpoints[sample(length(gridpoints$x), nBalls),]
    
    data.df <- list(height = h,
                    nCat = input$nCat,
            counts = as.list(counts),
            nBalls = sum(counts), 
            radius = radius,
            nDraws = nDraws,
            x = as.list(sampleLocs$x - h/2), ## sample from a grid of points
            y = as.list(sampleLocs$y - h/2 - radius) ,
            labels = groups,
            replace = input$replace,
            balls = balls,
            drawColor = as.list(drawColor))
    data.df
  }) 
  
  output$mixPlot <- reactive( { data() })  #when data changes, update the bar plot
  output$summary <- renderPrint({
    data.df <- data()
    runs <-  rle(data.df$balls[1:data.df$nDraws])
    out1 <-  c( summary( factor(data.df$balls[1:data.df$nDraws],
                                levels=data.df$labels)), max(runs[[1]]))
    names(out1)[data.df$nCat + 1] <- "maxRunLength"
    out1
  })
})

## Testing:
## input=list(counts=c(2,3,2),nCat = 3, nBalls = 7,nDraws=2,radius=20,groups=LETTERS[1:3])
##  balls=sample(rep(LETTERS[1:3],c(2,3,2)))
##  nDraws <- input$nDraws
## counts=c(2,3,2)
## data.df <- list( nCat = input$nCat, counts = as.list(counts),
##  nBalls = sum(counts),  nDraws = nDraws,  labels = input$groups,  replace = input$replace,  balls = as.list(balls))
##  runs <-  rle(unlist(data.df$balls)[1:data.df$nDraws])
##     out1 <-  c( summary( factor(unlist(data.df$balls)[1:data.df$nDraws],
##                                 levels=data.df$labels)), max(runs[[1]]))
##     names(out1)[data.df$nCat + 1] <- "maxRunLength"
##     out1
